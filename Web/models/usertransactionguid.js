var mongoose = require("mongoose");

var Schema = mongoose.Schema;
/*
    transactionType => 1: Verification Email
                    => 2: Reset Password
                    => 3: Api Login and Get Token
                    => 4: User Interface Login
*/
var usertransactionguidSchema = new Schema({
    createDateStamp: {
        type: Number,
        required: true
    },
    updateDateStamp: Number,
    transactionGUID: String,
    transactionType: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("usertransactionguid", usertransactionguidSchema);