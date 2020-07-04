var mongoose = require('mongoose');
 
var ChatSchema = new mongoose.Schema({
    group_id: {
        type: String,
        required: true,
        index: { unique: true }
    },
    dp: {
        type: Object,
        required: true
    },
    name: {
        type: Object,
        required: true
    },
    members: {
    	type: Array,
        required: true
    },
    silent_members: {
    	type: Array,
        required: true
    },
    admin: {
    	type: Array,
        required: true
    },
    messages: {
    	type: Array
    },
    last_login: {
        type: Object
    },
    active: {
        type: Boolean,
    },
}, {
    timestamps: true
});
 
module.exports = mongoose.model('Chat', ChatSchema);

// messages: {
//     from: String,
//     created: Date,
//     type: String,
//     text: String,
// } 
