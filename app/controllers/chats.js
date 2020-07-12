var Chat = require("../models/chat");
var AWS = require("aws-sdk");
var fs = require("fs");
var mime = require("mime-types");
var inspect = require("util").inspect;
const Pusher = require("pusher");
const Sentiment = require("sentiment");

const sentiment = new Sentiment();
// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID,
//   key: process.env.PUSHER_KEY,
//   secret: process.env.PUSHER_SECRET,
//   cluster: process.env.PUSHER_CLUSTER,
//   encrypted: true
// });

const BUCKET_NAME = "olwspark";
const IAM_USER_KEY = "AKIAIFJ6LTJD65VW6V4A";
const IAM_USER_SECRET1 = "XbbcDB1Qo92";
const IAM_USER_SECRET2 = "wT2wnp4mO9qLGpD+";
const IAM_USER_SECRET3 = "GNEEyfqqj4EoS";

exports.getChatListing = function(req, res, next) {
  Chat.find(
    {},
    {
      _id: 1,
      group_id: 1,
      dp: 1,
      name: 1,
      members: 1,
      silent_members: 1,
      admin: 1,
      last_login: 1,
      active: 1
    },
    function(err, chats) {
      if (err) {
        res.send(err);
      }
      res.json(chats);
    }
  );
};

exports.getChatMessages = function(req, res, next) {
  var userId = req.params.userId;
  var chatId = req.params.chatId;
  Chat.findOne({ _id: chatId }, { messages: 1 }, function(err, chats) {
    if (err) {
      res.send(err);
    }
    chatId + "/" + userId;
    res.json(chats);
  });

  Chat.findOne({ _id: chatId }, { _id: 1, last_login: 1 }, function(
    err,
    chats
  ) {
    if (!err) {
      if (chats.last_login) {
        chats.last_login[userId] = new Date();
      } else {
        chats.last_login = {};
        chats.last_login[userId] = new Date();
      }
      Chat.findOneAndUpdate(
        { _id: chats._id },
        { $set: { last_login: chats.last_login } },
        function(err, chat) {}
      );
    }
  });
};

exports.updateChatMessage = function(req, res, next) {
  var id = req.params.id;
  var message = req.body;
  message.sentiment = sentiment.analyze(message.text ? message.text : "");
  Chat.findOneAndUpdate({ _id: id }, { $set: { messages: message } }, function(
    err,
    chat
  ) {
    if (err) return res.send(err);
    res.json(chat);
  });
};

exports.updateChat = function(req, res, next) {
  var id = req.params.id;
  Chat.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: req.body.name,
        members: req.body.members,
        silent_members: req.body.silent_members,
        dp: req.body.dp,
        admin: req.body.admin,
        active: req.body.active
      }
    },
    function(err, chat) {
      if (err) return res.send(err);
      res.json(chat);
    }
  );
};

exports.createChat = function(req, res, next) {
  var chat = req.body;
  Chat.create(chat, function(err, chat) {
    if (err) {
      res.send(err);
    }
    res.json(chat);
  });
};

exports.uploadToS3 = function(req, res, next) {
  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET1 + IAM_USER_SECRET2 + IAM_USER_SECRET3,
    Bucket: BUCKET_NAME,
    ServerSideEncryption: "AES256"
  });
  req.body.file = req.body.file.replace(/^data:[\w\W]*;base64,/, "");
  const base64Data = new Buffer.from(req.body.file, "base64");
  s3bucket.createBucket(function() {
    var params = {
      Bucket: BUCKET_NAME,
      Key: req.body.file_name,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: req.body.file_mime
    };
    console.log("------------------------------------------------------------");
    console.log("S3 UPLOAD PARAMS", params);
    console.log("------------------------------------------------------------");
    s3bucket.upload(params, function(err, data) {
      if (err) {
        console.log("err", err);
        res.send(err);
      }
      console.log(data);
      res.json(data);
    });
  });
};
