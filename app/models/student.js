var mongoose = require('mongoose');
 
var StudentSchema = new mongoose.Schema({
 
    student_id: {
        type: String, // Boolean, Date, Number
        required: true,
        index: { unique: true },
        default: ''
    },
  
}, {
    timestamps: true
});
 
module.exports = mongoose.model('Student', StudentSchema);