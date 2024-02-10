var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var sendMailQueueSchema = new Schema({
    idU: {
        type: String,
        required: true
    },
    createDateStamp: {
        type: Number,
        required: true
    },
    updateDateStamp: Number,
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    html: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    status: {
        /*
            1=> Send Awaiting
            2=> Send Successfully
            3=> Send Error
        */
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("sendmailqueue", sendMailQueueSchema);