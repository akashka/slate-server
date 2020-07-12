var mongoose = require('mongoose');

var CenterSchema = new mongoose.Schema({

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
    },
    programs: {
        type: Array,
        default: ['5c7a93b6bad67372d48c6c17', '5d2219df5bedd22d45e768e6', '5d221a005bedd22d45e768e7', '5d221a215bedd22d45e768e8'],
        required: true
    },
    bill_no: {
        type: Number,
        default: 0,
        required: true
    },
    addressLine1: {
        type: String
    },
    addressLine2: {
        type: String
    },
    phone: {
        type: String
    },
    email_id: {
        type: String
    }

}, {
        timestamps: true
    });

module.exports = mongoose.model('Center', CenterSchema);
