var mongoose = require("mongoose");

var OnlineSchema = new mongoose.Schema(
  {
    txtsname: {
      type: String
    },
    txtsdob: {
      type: String
    },
    txtsadd: {
      type: String
    },
    txtscontact: {
      type: String
    },
    txtsemail: {
      type: String
    },
    txtlanguage: {
      type: String
    },
    txtinterest: {
      type: String
    },
    txtschool: {
      type: String
    },
    txtschooladd: {
      type: String
    },
    txtfname: {
      type: String
    },
    txtfoccupation: {
      type: String
    },
    txtfoffadd: {
      type: String
    },
    txtfoffcontact: {
      type: String
    },
    txtfmail: {
      type: String
    },
    txtmname: {
      type: String
    },
    txtmoccupation: {
      type: String
    },
    txtmoffadd: {
      type: String
    },
    txtmoffcontact: {
      type: String
    },
    txtmmail: {
      type: String
    },
    txtprograms: {
      type: Array
    },
    txthdyk: {
      type: String
    },
    photo: {
      type: String
    },
    idproof: {
      type: String
    },
    referralcode: {
      type: String
    },
    paymentStatus: {
      type: String
    },
    paymentDetails: {
      type: Object
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Online", OnlineSchema);
