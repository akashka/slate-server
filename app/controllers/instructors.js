var Instructor = require("../models/instructor");

exports.getInstructors = function(req, res, next) {
  Instructor.find(function(err, instructors) {
    if (err) {
      res.send(err);
    }
    res.json(instructors);
  });
};

exports.createInstructor = function(req, res, next) {
  let instructor = req.body;
  Instructor.create(instructor, function(err, instructor) {
    if (err) {
      res.send(err);
    }
    Instructor.find(function(err, instructors) {
      if (err) {
        res.send(err);
      }
      res.json(instructors);
    });
  });
};

exports.updateInstructor = function(req, res, next) {
  let id = req.body._id;
  let instructor = req.body;
  delete instructor._id;

  console.log(instructor);
  console.log(id);

  Instructor.findOneAndUpdate(
    { _id: id },
    instructor,
    { upsert: true, new: true },
    function(err, instructor) {
      if (err) return res.send(err);
      res.json(instructor);
    }
  );
};

exports.printIdCard = function(req, res, next) {
  let card = req.body;

  var stringTemplate = fs.readFileSync(
    path.join(__dirname, "../helpers/ci-id-card") + "/ci-id-card.html",
    "utf8"
  );

  stringTemplate = stringTemplate.replace(
    "{{Name}}",
    card.name ? card.name : ""
  );
  stringTemplate = stringTemplate.replace(
    "{{InstructorIdNo}}",
    card.instructorIdNo ? card.instructorIdNo : ""
  );
  stringTemplate = stringTemplate.replace(
    "{{centerCodeName}}",
    card.centerCodeName ? card.centerCodeName : ""
  );
  stringTemplate = stringTemplate.replace(
    "{{memberSince}}",
    card.memberSince ? card.memberSince : ""
  );
  stringTemplate = stringTemplate.replace(
    "{{validTill}}",
    card.validTill ? card.validTill : ""
  );

  stringTemplate = stringTemplate.replace(
    "{{resAddressLine1}}",
    card.resAddressLine1 ? card.resAddressLine1 : ""
  );
  stringTemplate = stringTemplate.replace(
    "{{resAddressLine2}}",
    card.resAddressLine2 ? card.resAddressLine2 : ""
  );
  stringTemplate = stringTemplate.replace(
    "{{resAddressLine3}}",
    card.resAddressLine3 ? card.resAddressLine3 : ""
  );

  stringTemplate = stringTemplate.replace(
    "{{phone}}",
    card.phone ? card.phone : ""
  );
  stringTemplate = stringTemplate.replace(
    "{{emailId}}",
    card.emailId ? card.emailId : ""
  );

  stringTemplate = stringTemplate.replace(
    "{{DisplaySM}}",
    card.programmes && card.programmes.length > 0
      ? SearchArray("Speed Maths", card.programmes)
      : "none"
  );

  stringTemplate = stringTemplate.replace(
    "{{DisplayMA}}",
    card.programmes && card.programmes.length > 0
      ? SearchArray("Mental Arithmetic", card.programmes)
      : "none"
  );

  stringTemplate = stringTemplate.replace(
    "{{DisplayTT}}",
    card.programmes && card.programmes.length > 0
      ? SearchArray("Tiny Tots", card.programmes)
      : "none"
  );

  stringTemplate = stringTemplate.replace(
    "{{DisplayES}}",
    card.programmes && card.programmes.length > 0
      ? SearchArray("English Smart", card.programmes)
      : "none"
  );

  var mailTemplate = fs.readFileSync(
    path.join(__dirname, "../helpers/ci-id-card") + "/mailer.html",
    "utf8"
  );

  pdf.create(stringTemplate).toBuffer(function(err, buffer) {
    encodedData = buffer.toString("base64");
    var attachmentDetails = [
      {
        content: encodedData,
        filename: "id-card.pdf"
      }
    ];

    sendInfoMail(
      "Aloha India Instructor ID Card",
      mailTemplate,
      card.email_id,
      attachmentDetails
    );
  });
};

var sendInfoMail = function(subject, mailTemplate, mailTo, attachments) {
  var mailOptions = {
    to: mailTo,
    from: "info@aloha.com",
    subject: subject,
    text: "  ",
    html: mailTemplate
  };
  if (attachments) {
    mailOptions.attachments = attachments;
  }
  sgMail.send(mailOptions, function(err) {
    console.log("Err in mailing: " + err);
  });
};

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
