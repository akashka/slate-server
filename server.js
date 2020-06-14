var express = require("express");
var app = express();
var mongoose = require("mongoose");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var bodyParser = require("body-parser");
var multer = require("multer");
var fs = require("fs");
var databaseConfig = require("./config/database");
var router = require("./app/routes");

mongoose.connect(databaseConfig.url);
console.log(databaseConfig);

app.listen(process.env.PORT || 8080);
console.log("App listening on port 8080");

app.use(
  bodyParser.urlencoded({
    parameterLimit: 10000000,
    limit: "5000mb",
    extended: true
  })
); // Parses urlencoded bodies

app.use(bodyParser.json({ limit: "5000mb" })); // Send JSON responses
app.use(logger("dev")); // Log requests to API using morgan
app.use(cors());

// app.post(
//   "/uploadFile",
//   multer({ dest: "../uploads/" }).array("uploads", 12),
//   function(req, res) {
//     console.log(req);
//     var fileInfo = [];
//     for (var i = 0; i < req.files.length; i++) {
//       fileInfo.push({
//         originalName: req.files[i].originalName,
//         size: req.files[i].size,
//         b64: new Buffer(fs.readFileSync(req.files[i].path)).toString("base64")
//       });
//       fs.unlink(req.files[i].path);
//     }
//     res.send(fileInfo);
//   }
// );

router(app);
