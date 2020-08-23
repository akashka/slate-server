var mongoose = require("mongoose");

var InstructorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    instructor_state: {
      type: String
    },
    instructor_district: {
      type: String
    },
    instructor_area: {
      type: String
    },
    program: {
      type: Array,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
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
      type: Date
    },
    qualification: {
      type: String
    },
    old_organization_name: {
      type: String
    },
    old_organization_designation: {
      type: String
    },
    total_experience: {
      type: String
    },
    status: {
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
    salary: {
      type: String
    },
    bank_account_number: {
      type: String
    },
    bank_account_name: {
      type: String
    },
    bank_ifsc_code: {
      type: String
    },
    pan_no: {
      type: String
    },
    pf_no: {
      type: String
    },
    address_proof: {
      type: Array
    },
    id_proof: {
      type: Array
    },
    follow_up: {
      type: Array
    },
    tenure: {
      type: Number
    },
    confirmation_by: {
      type: String
    },
    confirmation_datetime: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Instructor", InstructorSchema);
