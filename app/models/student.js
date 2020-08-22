var mongoose = require("mongoose");

var StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    grade: {
      type: Number
    },
    school_name: {
      type: String
    },
    school_address: {
      type: String
    },
    mobile_no: {
      type: String,
      required: true,
      index: { unique: true }
    },
    whatsapp_no: {
      type: String
    },
    email_id: {
      type: String,
      required: true
    },
    dob: {
      type: Date,
      required: true
    },
    parent_name: {
      type: String,
      required: true
    },
    address: {
      type: String
    },
    state: {
      type: String,
      required: true
    },
    district: {
      type: String
    },
    area: {
      type: String
    },
    program: {
      type: Array
    },
    contact_time: {
      type: String
    },
    status: {
      type: String
    },
    referral: {
      type: String
    },
    remarks: {
      type: String
    },
    active: {
      type: Boolean,
      required: true,
      default: true
    },
    registration_no: {
      type: String
    },
    photo: {
      type: Array
    },
    enquiry_by: {
      type: String
    },
    enquiry_datetime: {
      type: Date,
      default: new Date()
    },
    kit_number: {
      type: String
    },
    course_instructor: {
      type: Array
    },
    birth_certificate: {
      type: Array
    },
    id_proof: {
      type: Array
    },
    level: {
      type: Number,
      default: 1
    },
    batch_no: {
      type: String
    },
    promotions: {
      type: Array
    },
    attendance: {
      type: Array
    },
    payments: {
      type: Array
    },
    confirm_datetime: {
      type: Date
    },
    confirm_by: {
      type: String
    },
    follow_up: {
      type: Array
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Student", StudentSchema);

/* promotion: {
    promotion_date, promotion_by, promotion_to, marks_scored, marks_sheet attachment, remarks,
    student_payment_amount, student_payment_date, student_payment_mode, , center_payment, 
} */

/* attendance: {level, attendance_datetime, attendance_by, attendance_location} */

/*  */
