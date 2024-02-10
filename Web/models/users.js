var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var userSchema = new Schema({
    idU: {
        type: String,
        required: true
    },
    createDateStamp: {
        type: Number,
        required: true
    },
    updateDateStamp: Number,
    nameSurname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        required: true
    },
    emailApproved: {
        type: Boolean,
        required: true
    },
    apiEnabled: {
        type: Boolean,
        required: true
    },
    passive: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model("users", userSchema);