var Online = require("../models/online");
var otpGenerator = require("otp-generator");
var curl = require("curlrequest");
var AWS = require("aws-sdk");
const crypto = require("crypto");
const axios = require("axios");

var smsUrl =
  "https://smsapp.mx9.in/smpp/?username=alohaindia&password=9790944889&from=ALOHAS&to=91";

const BUCKET_NAME = "olwspark";
const IAM_USER_KEY = "AKIAIFJ6LTJD65VW6V4A";
const IAM_USER_SECRET1 = "XbbcDB1Qo92";
const IAM_USER_SECRET2 = "wT2wnp4mO9qLGpD+";
const IAM_USER_SECRET3 = "GNEEyfqqj4EoS";

exports.payments = function(req, res, next) {
  var body = req.body;
  console.log(body);
  Online.find({_id: body.orderId}, function(err, online) {
    if (err) {
      res.send(err);
    }
    online = online[0];
    var ols = { 
      paymentStatus: body.txStatus,
      txtsname: online.txtsname,
      txtsdob: online.txtsdob,
      txtsadd: online.txtsadd,
      txtscontact: online.txtscontact,
      txtsemail: online.txtsemail,
      txtlanguage: online.txtlanguage,
      txtinterest: online.txtinterest,
      txtschool: online.txtschool,
      txtschooladd: online.txtschooladd,
      txtfname: online.txtfname,
      txtfoccupation: online.txtfoccupation,
      txtfoffadd: online.txtfoffadd,
      txtfoffcontact: online.txtfoffcontact,
      txtfmail: online.txtfmail,
      txtmname: online.txtmname,
      txtmoccupation: online.txtmoccupation,
      txtmoffadd: online.txtmoffadd,
      txtmoffcontact: online.txtmoffcontact,
      txtmmail: online.txtmmail,
      txthdyk: online.txthdyk,
      photo: online.photo,
      idproof: online.idproof,
      referralcode: online.referralcode,
      txtprograms: online.txtprograms
    };

    Online.findOneAndUpdate(
      { _id: body.orderId },
      ols,
      { upsert: true, new: true },
      function(err, online) {
        if (err) return res.send(err);
        if(body.txStatus === 'SUCCESS') {
          res.writeHead(301, { "Location": "http://www.alohaindia.com/payment-success/" });
          return res.end();
        }
        res.writeHead(301, { "Location": "http://www.alohaindia.com/payment-failure/" });
        return res.end();
      }
    );
  });  
}

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
  Online.create(online, function(err, response) {
    if (err) res.send(err);
    var resp = createCheksum(response);
    res.json(resp);
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

createCheksum = function(online) {
  var secretKey = "283652717282d5c46bd11312b6b5a0fcb02f9e85";
  var postData = {
    appId: "178734b4e7b64cebf065215a437871",
    orderId: online._id,
    orderAmount: (6500*online.txtprograms.length).toString(),
    orderCurrency: 'INR',
    customerName: online.txtsname,
    customerPhone: online.txtscontact,
    customerEmail: online.txtsemail,
    returnUrl: "https://slate-server.herokuapp.com/api/online/payments",
    notifyUrl: "https://slate-server.herokuapp.com/api/online/payments"
  };

  var keys = Object.keys(postData);
  keys.sort();
  var signatureData = "";
  keys.forEach(key => {
    signatureData += key + postData[key];
  });
  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(signatureData)
    .digest("base64");
  postData.signature = signature;
  return postData;
};
