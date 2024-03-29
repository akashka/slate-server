var mongoose = require('mongoose');

var NotificationSchema = new mongoose.Schema({

    center_id: {
        type: String,
        required: true,
        index: { unique: true },
    },
    center_name: {
        type: String,
        required: true,
    },
    center_type: {
        type: String,
        required: true,
        enum: ['state', 'district', 'unit'],
        default: 'unit',
    },
    center_parent: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    }

}, {
        timestamps: true
    });

module.exports = mongoose.model('Notification', NotificationSchema);