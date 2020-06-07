var Online = require("../models/online");
var otpGenerator = require("otp-generator");
var curl = require("curlrequest");
var AWS = require("aws-sdk");

var smsUrl =
  "https://smsapp.mx9.in/smpp/?username=alohaindia&password=9790944889&from=ALOHAS&to=91";

const BUCKET_NAME = "olwspark";
const IAM_USER_KEY = "AKIAIFJ6LTJD65VW6V4A";
const IAM_USER_SECRET1 = "XbbcDB1Qo92";
const IAM_USER_SECRET2 = "wT2wnp4mO9qLGpD+";
const IAM_USER_SECRET3 = "GNEEyfqqj4EoS";

exports.getOnline = function(req, res, next) {
  Online.find(function(err, onlines) {
    if (err) {
      res.send(err);
    }
    res.json(onlines);
  });
};

exports.createOnline = function(req, res, next) {
  let online = req.body;
  Online.create(online, function(err, online) {
    if (err) {
      res.send(err);
    }
    res.json(online);
  });
};

exports.updateOnline = function(req, res, next) {
  let id = req.body._id;
  let online = req.body;
  delete online._id;

  Online.findOneAndUpdate(
    { _id: id },
    online,
    { upsert: true, new: true },
    function(err, online) {
      if (err) return res.send(err);
      res.json(online);
    }
  );
};

exports.generateOTP = function(req, res, next) {
  console.log(req.params);
  var username = req.params.number;
  var otp = otpGenerator.generate(4, {
    upperCase: false,
    specialChars: false,
    alphabets: false
  });
  var messageData =
    "Greetings from Aloha. Your One Time Password (OTP) is " +
    otp +
    " This is valid for 15 minutes only. Do not share this OTP with anyone for security reasons.";
  var formData = smsUrl + username + "&text=" + encodeURIComponent(messageData);
  curl.request(formData, function optionalCallback(err, body) {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    res.json(body);
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
