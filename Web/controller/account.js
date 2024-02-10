class account {
    constructor() {
        this.users = require('../models/users');
        this.ejs = require("ejs");
        this.usertransactionguid = require('../models/usertransactionguid');
        this.uuid = require('uuid');
        const sendMail = require('../helper/sendMailFunc');
        this.sendMailFunc = new sendMail();
        this.jwt = require('jsonwebtoken');
        this.config = require('../config.json');
    }

    async login(email, pass) {
        var responseMessage = null;
        var responseStatus = false;
        var responseData = null;
        var responseToken = null;
        
        try {
            if (email) {
                if (pass) {
                    let promiseLogin = new Promise(async (resolve, reject) => {
                        let result = await this.users.findOne({
                            email: email
                        });

                        if (result) {
                            if (result.pass == pass) {
                                if (!result.passive) {
                                    if (result.emailApproved) {
                                        if (result.approved) {
                                            const accessToken = this.jwt.sign({
                                                idU: result.idU,
                                                email: result.email,
                                                nameSurname: result.nameSurname,
                                                passive: result.passive
                                            },
                                            this.config.JWTSecret,
                                            {
                                                expiresIn :"1d"
                                            });

                                            await new this.usertransactionguid({
                                                createDateStamp: new Date().getTime(),
                                                transactionType: 4,
                                                userId: result.idU
                                            }).save();

                                            responseToken = accessToken;
                                            
                                            responseStatus = true;

                                            responseMessage = "Login successful";

                                            resolve(result);
                                        }
                                        else {
                                            responseMessage = "Contact the system administrator for account verification before Login";
                                            resolve(null);
                                        }
                                    }
                                    else {
                                        responseMessage = "You must verify your Email address before Login";
                                        resolve(null);
                                    }
                                }
                                else {
                                    responseMessage = "Your Account is Passive! Contact the system administrator before Login";
                                    resolve(null);
                                }
                            }
                            else {
                                responseMessage = "Password entered incorrectly";
                                resolve(null);
                            }
                        }
                        else {
                            responseMessage = "Email not found";
                            resolve(null);
                        }

                    });

                    responseData = await promiseLogin;
                }
                else {
                    responseMessage = "Password is required!";
                }
            }
            else {
                responseMessage = "Email is required!";
            }
        } catch (error) {
            responseMessage = "Login failed, please contact system administrator";
        }

        return { success: responseStatus, message: responseMessage, data: responseData, token: responseToken };
    }

    async register(userModel) {
        var responseMessage = "";
        try {
            if(userModel.nameSurname) {
                if(userModel.email) {
                    if(userModel.pass) {
                        let promiseRegister = new Promise(async (resolve, reject) => {
                            let result = await this.users.findOne({
                                email: userModel.email
                            });

                            if(result == null) {
                                
                                try {
                                    
                                    await userModel.save();
                                    
                                    try {
                                        
                                        var transactionGUID = this.uuid.v4();

                                        await new this.usertransactionguid({
                                            createDateStamp: userModel.createDateStamp,
                                            transactionGUID: transactionGUID,
                                            transactionType: 1,
                                            userId: userModel.idU
                                        }).save();

                                        this.ejs.renderFile(process.cwd() + "/views/email-templates/verification-email.ejs", { 
                                            userTransactionGUID: transactionGUID,
                                            nameSurname: userModel.nameSurname
                                        }, (err, dataHTML) => {
                                            if(!err) {
                                                this.sendMailFunc.sendMailWithQueue(userModel.email, "Kurgun Heart Monitor Email Verification", dataHTML).then((sendMailResult) => {

                                                    if(!sendMailResult.error) {
                                                        resolve("Registration successful, please go to your email address and click the verification link");
                                                    }
                                                    else {
                                                        resolve("Registration is successful but verification email could not be sent, please contact system administrator.");
                                                    }

                                                });
                                            }
                                            else {
                                                resolve("Registration is successful but verification email could not be sent, please contact system administrator.");
                                            }
                                        });

                                    } catch (error) {
                                        resolve("Registration is successful but verification email could not be sent, please contact system administrator.");
                                    }

                                } catch (error) {
                                    resolve("Registration failed, please try again");
                                }
                                
                            }
                            else {
                                resolve("Email address is already taken, try another");
                            }
                            
                        });
                        
                        let result = await promiseRegister;
                        responseMessage = result;
                    }
                    else {
                        responseMessage = "Password is required!";
                    }
                }
                else {
                    responseMessage = "Email is required!";
                }
            }
            else {
                responseMessage = "Name and Surname is required!";
            }
        } catch (error) {
            responseMessage = "Register failed, please contact system administrator";
        }
        return responseMessage;
    }

    async verificationEmail(transactionGUIDEmail) {
        var responseMessage = "";
        try {
            if(transactionGUIDEmail) {
                if(this.uuid.validate(transactionGUIDEmail)) {
                    let promiseVerificationEmail = new Promise(async (resolve, reject) => {

                        let result = await this.usertransactionguid.findOne({
                            transactionGUID: transactionGUIDEmail
                        });

                        if(result) {
                            if(result.transactionType == 1) {
                                if(!result.updateDateStamp) {

                                    try {
                                        
                                        await this.usertransactionguid.updateOne(
                                            {transactionGUID: transactionGUIDEmail},
                                            {updateDateStamp: new Date().getTime()},
                                            {upsert: false, multi: false}
                                        );

                                        try {
                                            
                                            await this.users.updateOne(
                                                {idU: result.userId}, 
                                                {updateDateStamp: new Date().getTime(), emailApproved: true},
                                                {upsert: false, multi: false}
                                            );
                                            
                                            resolve({error: false, message: "Email verification completed successfully, please contact system administrator for account verification."});

                                        } catch (error) {
                                            resolve({error: true, message: "Verification failed! please try again, please contact system administrator."});
                                        }

                                    } catch (error) {
                                        resolve({error: true, message: "Verification failed! please try again, please contact system administrator."});
                                    }
                                    
                                }
                                else {
                                    resolve({error: true, message: "Verification key previously used"});
                                }
                            }
                            else {
                                resolve({error: true, message: "Invalid verification process"});
                            }
                        }
                        else {
                            resolve({error: true, message: "Invalid request! verification key not found"});
                        }
                        
                    });
                    let result = await promiseVerificationEmail;
                    responseMessage = result;
                }
                else {
                    responseMessage = {error: true, message: "Verification key is not valid!"};
                }
            }
            else {
                responseMessage = {error: true, message: "Verification key is required"};
            }
        } catch (error) {
            responseMessage = "Verification Email failed, please contact system administrator";
        }
        return responseMessage;
    }

    async resetPassword(userModel) {
        var responseMessage = "";
        try {
            if(userModel.email) {
                let promiseResetPassword = new Promise(async (resolve, reject) => {

                    let result = await this.users.findOne({
                        email: userModel.email
                    });

                    if(result) {
                        if(!result.passive) {
                            if(result.emailApproved) {
                                if(result.approved) {

                                    let resultIsThere = await this.usertransactionguid.findOne({
                                        userId: result.idU,
                                        transactionType: 2,
                                        updateDateStamp: null
                                    });

                                    if (!resultIsThere) {
                                        var transactionGUID = this.uuid.v4();
                                        var dateNow = new Date();

                                        try {
                                            await new this.usertransactionguid({
                                                createDateStamp: dateNow.getTime(),
                                                transactionGUID: transactionGUID,
                                                transactionType: 2,
                                                userId: result.idU
                                            }).save();

                                            this.ejs.renderFile(process.cwd() + "/views/email-templates/reset-password-email.ejs", {
                                                userTransactionGUID: transactionGUID,
                                                nameSurname: userModel.nameSurname
                                            }, (err, dataHTML) => {
                                                if(!err) {
                                                    this.sendMailFunc.sendMailWithQueue(userModel.email, "Kurgun Heart Monitor Reset Password", dataHTML).then((sendMailResult) => {

                                                        if(!sendMailResult.error) {
                                                            resolve("Reset Password request has been received, please go to your email address and click the new password link");
                                                        }
                                                        else {
                                                            resolve("Reset Password failed, please contact system administrator");
                                                        }

                                                    });
                                                }
                                                else {
                                                    resolve("Reset Password failed, please contact system administrator");
                                                }
                                            });

                                        } catch (error) {
                                            resolve("Reset Password failed, please contact system administrator");
                                        }
                                        
                                    }
                                    else {
                                        this.ejs.renderFile(process.cwd() + "/views/email-templates/reset-password-email.ejs", {
                                            userTransactionGUID: resultIsThere.transactionGUID,
                                            nameSurname: userModel.nameSurname
                                        }, (err, dataHTML) => {
                                            if(!err) {
                                                this.sendMailFunc.sendMailWithQueue(userModel.email, "Kurgun Heart Monitor Reset Password", dataHTML).then((sendMailResult) => {

                                                    if(!sendMailResult.error) {
                                                        resolve("Reset Password request has been received, please go to your email address and click the new password link");
                                                    }
                                                    else {
                                                        resolve("Reset Password failed, please contact system administrator");
                                                    }

                                                });
                                            }
                                            else {
                                                resolve("Reset Password failed, please contact system administrator");
                                            }
                                        });
                                    }
                                    
                                }
                                else {
                                    resolve("Contact the system administrator for account verification before Reset Password");
                                }
                            }
                            else {
                                resolve("You must verify your Email address before Reset Password");
                            }
                        }
                        else {
                            resolve("Your Account is Passive! Contact the system administrator");
                        }
                    }
                    else {
                        resolve("This Email is not registered!");
                    }
                    
                });

                let result = await promiseResetPassword;
                responseMessage = result;
            }
            else {
                responseMessage = "Email is required!";
            }
        } catch (error) {
            responseMessage = "Reset Password failed, please contact system administrator";
        }
        return responseMessage;
    }

    async verificationNewPasswordGUID(transactionGUIDNewPassword){
        var responseMessage = "";
        try {
            if(transactionGUIDNewPassword) {
                if(this.uuid.validate(transactionGUIDNewPassword)) {
                    let promiseVerificationNewPassword = new Promise(async (resolve, reject) => {

                        let result = await this.usertransactionguid.findOne({
                            transactionGUID: transactionGUIDNewPassword
                        });

                        if(result) {
                            if(result.transactionType == 2) {
                                if(!result.updateDateStamp) {
                                    resolve("New Password process verification successfull, please enter your new password.");
                                }
                                else {
                                    resolve("Verification key previously used");
                                }
                            }
                            else {
                                resolve("Invalid verification process");
                            }
                        }
                        else {
                            resolve("Invalid request! verification key not found");
                        }
                        
                    });
                    let result = await promiseVerificationNewPassword;
                    responseMessage = result;
                }
                else {
                    responseMessage = "Verification key is not valid!";
                }
            }
            else {
                responseMessage = "Verification key is required";
            }
        } catch (error) {
            responseMessage = "Verification key failed, please contact system administrator";
        }
        return responseMessage;
    }

    async saveNewPassword(transactionGUIDNewPassword, pass){
        var responseMessage = "";
        try {
            if(transactionGUIDNewPassword) {
                let promiseVerificationNewPassword = new Promise(async (resolve, reject) => {

                    let result = await this.usertransactionguid.findOne({
                        transactionGUID: transactionGUIDNewPassword
                    });

                    if(result) {
                        if(result.transactionType == 2) {
                            if(!result.updateDateStamp) {
                                
                                try {
                                    await this.usertransactionguid.updateOne(
                                        {transactionGUID: transactionGUIDNewPassword},
                                        {updateDateStamp: new Date().getTime()},
                                        {upsert: false, multi: false}
                                    );

                                    await this.users.updateOne(
                                        {idU: result.userId}, 
                                        {updateDateStamp: new Date().getTime(), pass: pass},
                                        {upsert: false, multi: false}
                                    );

                                    resolve("Password updated successfully");

                                } catch (error) {
                                    resolve("New password could not be saved! please try again, please contact system administrator.");
                                }
                                
                            }
                            else {
                                resolve("Verification key previously used");
                            }
                        }
                        else {
                            resolve("Invalid verification process");
                        }
                    }
                    else {
                        resolve("Invalid request! verification key not found");
                    }

                });
                let result = await promiseVerificationNewPassword;
                responseMessage = result;
            }
            else {
                responseMessage = "Verification key is required";
            }
        } catch (error) {
            responseMessage = "Password updated failed, please contact system administrator";
        }
        return responseMessage;
    }
}

module.exports = account;