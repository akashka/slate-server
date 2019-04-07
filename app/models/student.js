var mongoose = require('mongoose');
 
var StudentSchema = new mongoose.Schema({
 
    name: {
        type: String,
        required: true,
    },
    grade: {
        type: Number,
    },
    school_name: {
        type: String,
    },
    school_address: {
        type: String,
    },
    mobile_no: {
        type: String,
        required: true,
        index: { unique: true },
    },
    whatsapp_no: {
        type: String,
    },
    email_id: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    parent_name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    state: {
        type: String,
        required: true,
    },
    district: {
        type: String,
    },
    area: {
        type: String,
    },
    program: {
        type: Array
    },
    contact_time: {
        type: String,
    },
    status: {
        type: String,
    },
    referral: {
        type: String,
    },
    remarks: {
        type: String,
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    photo: {
        type: String,
    },
    enquiry_by: {
        type: String
    },
    enquiry_datetime: {
        type: Date,
        default: new Date()
    }

}, {
    timestamps: true
});
 
module.exports = mongoose.model('Student', StudentSchema);