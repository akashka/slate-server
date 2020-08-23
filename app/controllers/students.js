var Student = require("../models/student"),
  path = require("path"),
  fs = require("fs"),
  conversion = require("phantom-html-to-pdf")(),
  QRCode = require("qrcode");
var sgMail = require("@sendgrid/mail");
const createCsvWriter = require("csv-writer").createArrayCsvWriter;
var PptxGenJS = require("pptxgenjs");
var moment = require("moment");
var pdf = require("html-pdf");

var apiKey = "SG";
apiKey += ".41G";
apiKey += "-EH6mS";
apiKey += "-WT7ZWg_5bH";
apiKey += "-g";
apiKey += ".gEep1FU0lKjI8";
apiKey += "D4gd4zpY7a5HR7";
apiKey += "Up9jmE0AENHKO09A";
sgMail.setApiKey(apiKey);

exports.getStudent = function(req, res, next) {
  Student.find(function(err, students) {
    if (err) {
      res.send(err);
    }
    res.json(students);
  });
};

exports.createStudent = function(req, res, next) {
  let student = req.body;
  Student.create(student, function(err, student) {
    if (err) {
      res.send(err);
    }
    Student.find(function(err, students) {
      if (err) {
        res.send(err);
      }
      res.json(students);
    });
  });
};

exports.updateStudent = function(req, res, next) {
  let id = req.body._id;
  let student = req.body;
  delete student._id;
  delete student.__v;

  Student.findOneAndUpdate(
    { _id: id },
    student,
    { upsert: true, new: true },
    function(err, student) {
      if (err) {
        console.log("Error in updating student: " + JSON.stringify(err));
        return res.send(err);
      }
      res.json(student);
    }
  );
};

function Rs(amount) {
  var words = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
    "Twenty"
  ];
  words[30] = "Thirty";
  words[40] = "Forty";
  words[50] = "Fifty";
  words[60] = "Sixty";
  words[70] = "Seventy";
  words[80] = "Eighty";
  words[90] = "Ninety";
  var op;
  amount = amount.toString();
  var atemp = amount.split(".");
  var number = atemp[0].split(",").join("");
  var n_length = number.length;
  var words_string = "";
  if (n_length <= 9) {
    var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    var received_n_array = new Array();
    for (var i = 0; i < n_length; i++) {
      received_n_array[i] = number.substr(i, 1);
    }
    for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
      n_array[i] = received_n_array[j];
    }
    for (var i = 0, j = 1; i < 9; i++, j++) {
      if (i == 0 || i == 2 || i == 4 || i == 7) {
        if (n_array[i] == 1) {
          n_array[j] = 10 + parseInt(n_array[j]);
          n_array[i] = 0;
        }
      }
    }
    value = "";
    for (var i = 0; i < 9; i++) {
      if (i == 0 || i == 2 || i == 4 || i == 7) {
        value = n_array[i] * 10;
      } else {
        value = n_array[i];
      }
      if (value != 0) {
        words_string += words[value] + " ";
      }
      if (
        (i == 1 && value != 0) ||
        (i == 0 && value != 0 && n_array[i + 1] == 0)
      ) {
        words_string += "Crores ";
      }
      if (
        (i == 3 && value != 0) ||
        (i == 2 && value != 0 && n_array[i + 1] == 0)
      ) {
        words_string += "Lakhs ";
      }
      if (
        (i == 5 && value != 0) ||
        (i == 4 && value != 0 && n_array[i + 1] == 0)
      ) {
        words_string += "Thousand ";
      }
      if (
        i == 6 &&
        value != 0 &&
        (n_array[i + 1] != 0 && n_array[i + 2] != 0)
      ) {
        words_string += "Hundred and ";
      } else if (i == 6 && value != 0) {
        words_string += "Hundred ";
      }
    }
    words_string = words_string.split(" ").join(" ");
  }
  return words_string;
}

function RsPaise(n) {
  nums = n.toString().split(".");
  var whole = Rs(nums[0]);
  if (nums[1] == null) nums[1] = 0;
  if (nums[1].length == 1) nums[1] = nums[1] + "0";
  if (nums[1].length > 2) {
    nums[1] = nums[1].substring(2, length - 1);
  }
  if (nums.length == 2) {
    if (nums[0] <= 9) {
      nums[0] = nums[0] * 10;
    } else {
      nums[0] = nums[0];
    }
    var fraction = Rs(nums[1]);
    if (whole == "" && fraction == "") {
      op = "Zero only";
    }
    if (whole == "" && fraction != "") {
      op = "paise " + fraction + " only";
    }
    if (whole != "" && fraction == "") {
      op = "Rupees " + whole + " only";
    }
    if (whole != "" && fraction != "") {
      op = "Rupees " + whole + "and paise " + fraction + " only";
    }
  }
  return op;
}

function joinArray(arr) {
  var str = "";
  for (var i = 0; i < arr.length; i++) {
    if (i != 0) {
      str += ", ";
    }
    str += arr[i];
  }
  return str;
}

function SearchArray(element, array) {
  var len = array.length,
    str = element.toString().toLowerCase();
  for (var i = 0; i < len; i++) {
    if (array[i].toLowerCase() == str) {
      return "block";
    }
  }
  return "none";
}

var sendInfoMail = function(subject, mailTemplate, mailTo, bcc, attachments) {
  var mailOptions = {
    to: mailTo,
    from: "info@aloha.com",
    subject: subject,
    text: "  ",
    html: mailTemplate
  };
  if (bcc) {
    mailOptions.bcc = bcc;
  }
  if (attachments) {
    mailOptions.attachments = attachments;
  }

  sgMail.send(mailOptions, function(err) {
    console.log("Err in mailing: " + err);
  });
};

exports.sendFeeReceipt = function(req, res, next) {
  let student = req.body;

  var text = "Student Name: " + student.name + "\n";
  text += "Reg. No: " + student.registration_no + "\n";
  text += "Receipt No: " + student.receipt_no + "\n";
  text += "Bill Dt: " + moment(student.bill_dt).format("dd/MMM/YYYY");

  console.log("Generating QR Code");
  QRCode.toDataURL(text, function(err, body) {
    var qrImage = err
      ? "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgICAgIBwcHBwcHBwoIBwcHBw8ICQcKFREWFhURExMYHSggGBolJxMTITEhJSkrLi4uFx8zODMsNygtLisBCgoKDQ0NFQ8PFSsdFR0rKys3Ny0rKys3KysrNys3KzcrLSsrKysrKystKysrLSsrLSsrKzcrLSsrKysrKysrK//AABEIASwAqAMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAAAAQIDB//EABwQAQEBAQEAAwEAAAAAAAAAAAABEQJBITFRA//EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFxEBAQEBAAAAAAAAAAAAAAAAAAERIf/aAAwDAQACEQMRAD8A9xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAS1U+NBQAAAAAAAAAAAAASrExQAAASArLQAAAAAAAAAAAAACUFAAAAAAAAAAAAAAAAAAAAAAAAEigAAAAAAAAAAAAAAAAAAIoAAAnqpICgAAAAAAAAAAAAAAAAAAAAAAAAAkUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAigAAAAAAAAAAAAAAAAJ6qRQRQAAAAAAAAAAAAAAAAABKBFAAAAAAEoAluS04+RGgBQAAAAAAABFAAAAAAAEUBj+n1n6vMyNYCZ0AFAAAAAAAAAAAAAAAAAABi9xqUFE1QAAAAAAAAAAAAAAAAGO98bTBK4c8Xdrt41hQkxy53XVmRpIoAoAAAAAAAAAAAAAAAAJaqUEjSRQAAAAAAf/Z"
      : body;
    var stringTemplate = fs.readFileSync(
      path.join(__dirname, "../helpers") + "/paymentreceipt/paymentreceipt.html",
      "utf8"
    );

    stringTemplate = stringTemplate.replace(
      "{{CenterName}}",
      student.center && student.center.name ? student.center.name : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{CenterCode}}",
      student.center && student.center.code ? student.center.code : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{AddressLine1}}",
      student.center && student.center.addressLine1
        ? student.center.addressLine1
        : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{AddressLine2}}",
      student.center && student.center.addressLine2
        ? student.center.addressLine2
        : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{PhoneNo}}",
      student.center && student.center.phone ? student.center.phone : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{Email}}",
      student.center && student.center.email_id ? student.center.email_id : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{ReceiptNo}}",
      student.receipt_no ? student.receipt_no : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{Date}}",
      moment(student.bill_dt).format("DD/MMM/YYYY")
    );
    stringTemplate = stringTemplate.replace(
      "{{StudentRegNo}}",
      student.registration_no ? student.registration_no : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{StudentName}}",
      student.name ? student.name.toUpperCase() : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{ParentName}}",
      student.parent_name ? student.parent_name.toUpperCase() : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{AmountInWords}}",
      student.amount ? RsPaise(Math.round(student.amount * 100) / 100) : "NA"
    );
    stringTemplate = stringTemplate.replace(
      "{{Particulars}}",
      student.particulars && student.particulars.length > 0
        ? joinArray(student.particulars)
        : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{Level}}",
      student.level ? student.level : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{Month}}",
      student.month ? student.month : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{Program}}",
      student.programmes && student.programmes.length > 0
        ? joinArray(student.programmes)
        : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{BatchNo}}",
      student.batch_no ? student.batch_no : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{CenterCode}}",
      student.center && student.center.code ? student.center.code : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{PaymentMode}}",
      student.payment_mode ? student.payment_mode : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{PayDate}}",
      student.cheque_dt ? moment(student.cheque_dt).format("DD/MMM/YYYY") : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{BankDetails}}",
      student.bank_name ? student.bank_name : ""
    );
    stringTemplate = stringTemplate.replace(
      "{{Amount}}",
      student.amount ? student.amount : ""
    );
    stringTemplate = stringTemplate.replace("{{QRCode}}", qrImage);
    stringTemplate = stringTemplate.replace(
      "{{DisplayMA}}",
      student.programmes && student.programmes.length > 0
        ? SearchArray("Mental Arithmetic", student.programmes)
        : "none"
    );
    stringTemplate = stringTemplate.replace(
      "{{DisplayTT}}",
      student.programmes && student.programmes.length > 0
        ? SearchArray("Tiny Tots", student.programmes)
        : "none"
    );
    stringTemplate = stringTemplate.replace(
      "{{DisplaySM}}",
      student.programmes && student.programmes.length > 0
        ? SearchArray("Speed Maths", student.programmes)
        : "none"
    );
    stringTemplate = stringTemplate.replace(
      "{{DisplayKA}}",
      student.programmes && student.programmes.length > 0
        ? SearchArray("Kids Art", student.programmes)
        : "none"
    );
    stringTemplate = stringTemplate.replace(
      "{{DisplayES}}",
      student.programmes && student.programmes.length > 0
        ? SearchArray("English Smart", student.programmes)
        : "none"
    );
    stringTemplate = stringTemplate.replace(
      "{{DisplayKS}}",
      student.programmes && student.programmes.length > 0
        ? SearchArray("KinderStart", student.programmes)
        : "none"
    );
    stringTemplate = stringTemplate.replace(
      "{{DisplayHW}}",
      student.programmes && student.programmes.length > 0
        ? SearchArray("HandWriting", student.programmes)
        : "none"
    );
    stringTemplate = stringTemplate.replace(
      "{{DisplayTB}}",
      student.programmes && student.programmes.length > 0
        ? SearchArray("Third Brain", student.programmes)
        : "none"
    );

    var mailTemplate = fs.readFileSync(
      path.join(__dirname, "../helpers") + "/receipt.html",
      "utf8"
    );

    pdf.create(stringTemplate).toBuffer(function(err, buffer) {
      encodedData = buffer.toString("base64");
      var attachmentDetails = [
        {
          content: encodedData,
          filename: "receipt.pdf"
        }
      ];

      sendInfoMail(
        "Thankyou for Payment at Aloha India",
        mailTemplate,
        student.email_id,
        student.center && student.center.email_id
          ? student.center.email_id
          : "",
        attachmentDetails
      );
      // Mail sent

      console.log("success");
      // res.send("Success");
    });
  });
};
