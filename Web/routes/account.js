var express = require('express');
var bodyParserJSON = require('../helper/bodyParserJSON');
var csrfProtection = require('../helper/csrfProtection');
var uuid = require('uuid');
var checkAuth = require('../helper/checkAuth');

var router = express.Router();

const account = require('../controller/account');
const users = require('../models/users');
const accountController = new account();

//Login
router.route('/login')
.get(csrfProtection, function(req, res, next) {
    res.render('account/login', { titleText: "Login", csrfToken: req.csrfToken(), layout: './layouts/login-layout' });
})
.post(csrfProtection, bodyParserJSON, async (req, res, next) => {
    var result = await accountController.login(req.body.email, req.body.pass);

    if (result.success && result.token) {
        req.session.loggedInToken = result.token;
    }

    res.send({ status: result.status, message: result.message });
});
//status, message, data, token
//Register
router.route('/register')
.get(csrfProtection, (req, res, next) => {
    res.render('account/register', { titleText: "Register", csrfToken: req.csrfToken(), layout: './layouts/login-layout' });
})
.post(csrfProtection, bodyParserJSON, async (req, res, next) => {
    var resMessage = "";
    if(req.body.termsCheck) {
        var result = await accountController.register(new users({
            idU: uuid.v4(),
            createDateStamp: new Date().getTime(),
            updateDateStamp: null,
            nameSurname: req.body.nameSurname,
            email: req.body.email,
            pass: req.body.pass,
            emailApproved: false,
            approved: false,
            apiEnabled: false,
            passive: false
        }));
        resMessage = result;
    }
    else {
        resMessage = "Please accept terms and conditions";
    }
    res.send(resMessage);
});

//Email Verification
router.route('/email-verification/:transactionGUID')
.get(async (req, res, next) => {
    var result = await accountController.verificationEmail(req.params.transactionGUID);
    res.render('account/email-verification', { titleText: "Email Verification", resultMessage: result.message, layout: './layouts/login-layout' });
});

//Reset Password
router.route('/reset-password')
.get(csrfProtection, function(req, res, next) {
    res.render('account/reset-password', { titleText: "Reset Password", csrfToken: req.csrfToken(), layout: './layouts/login-layout' });
})
.post(csrfProtection, bodyParserJSON, async (req, res, next) => {
    var result = await accountController.resetPassword(new users({
        email: req.body.email
    }));
    res.send(result);
});

//New Password
router.route('/new-password/:transactionGUID')
.get(csrfProtection, async (req, res, next) => {
    var result = await accountController.verificationNewPasswordGUID(req.params.transactionGUID);
    res.render('account/new-password', { titleText: "New Password", resultMessage: result, transactionGUID: req.params.transactionGUID, csrfToken: req.csrfToken(), layout: './layouts/login-layout' });
});

router.route('/new-password')
.post(csrfProtection, bodyParserJSON, async (req, res, next) => {
    var result = await accountController.saveNewPassword(req.body.tGuid, req.body.pass);
    res.send(result);
});

//Dashboard
router.route('/dashboard')
.get(csrfProtection, checkAuth, async (req, res, next) => {
    
    res.send({ data: req.loggedInUser });

});

router.route('/logout')
.get(checkAuth, async (req, res, next) => {
    
    req.session.destroy();

    res.send("Logout");
    
});


module.exports = router;