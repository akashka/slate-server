var fs = require("fs");
var path = require("path");
var request = require("request-promise");
var curl = require("curlrequest");
var sgMail = require("@sendgrid/mail");
var _ = require("lodash-node");
var json2csv = require("json2csv");
var base64 = require("base-64");
var AWS = require("aws-sdk");
var PDFImage = require("pdf-image").PDFImage;

const BUCKET_NAME = "alohaindia";
const IAM_USER_KEY = "AKIASMAYOHKOSSTW43D2";
const IAM_USER_SECRET1 = "MzYQ9vnB49Bw";
const IAM_USER_SECRET2 = "WTU1BQPu0xlKcH";
const IAM_USER_SECRET3 = "R4aQ0tYbPr6j4N";

exports.uploadToS3 = function(req, res, next) {
  let file_name = req.body.file_name;
  let file = req.body.file;
  console.log("Uploading File to S3 " + file_name);
  var buf = new Buffer(file.replace(/^data:image\/\w+;base64,/, ""), "base64");
  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET1 + IAM_USER_SECRET2 + IAM_USER_SECRET3,
    Bucket: BUCKET_NAME
  });
  console.log(s3bucket);
  s3bucket.createBucket(function() {
    var params = {
      Bucket: BUCKET_NAME,
      Key: file_name,
      Body: buf,
      ContentEncoding: "base64"
      // ContentType: 'image/jpeg'
    };
    s3bucket.upload(params, function(err, data) {
      if (err) {
        console.log("error in callback", err);
        res.send(err);
      }
      console.log("success", data);
      res.json(data);
    });
  });
};
