class api {
    constructor (){
        this.users = require('../../models/users');
        this.usertransactionguid = require('../../models/usertransactionguid');
        this.uuid = require('uuid');
        this.jwt = require('jsonwebtoken');
        this.config = require('../../config.json');
    }
    //Login
    async login(email, pass) {
        var responseMessage = "";
        var responseStatus = false;
        var responseResult = null;

        try {
            if (email) {
                if (pass) {
                    let promiseLogin = new Promise(async (resolve, reject) =>  {
                        let result = await this.users.findOne({
                            email: email
                        });

                        if (result) {
                            if (result.pass == pass) {
                                if (!result.passive) {
                                    if (result.emailApproved) {
                                        if (result.approved) {
                                            if (result.apiEnabled) {
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
                                                    transactionType: 3,
                                                    userId: result.idU
                                                }).save();
                                                
                                                responseStatus = true;

                                                resolve(accessToken);
                                            }
                                            else {
                                                resolve("Contact the system administrator for api verification before Login");
                                            }
                                        }
                                        else {
                                            resolve("Contact the system administrator for account verification before Login");
                                        }
                                    }
                                    else {
                                        resolve("You must verify your Email address before Login");
                                    }
                                }
                                else {
                                    resolve("Your Account is Passive! Contact the system administrator before Login");
                                }
                            }
                            else {
                                resolve("Password entered incorrectly");
                            }
                        }
                        else {
                            resolve("Email not found");
                        }
                    });

                    responseResult = await promiseLogin;
                    responseMessage = responseResult;
                }
                else {
                    responseMessage = "Password is required!";
                }
            }
            else {
                responseMessage = "Email is required!";
            }
        } catch (error) {
            responseMessage = "Api Login failed, please contact system administrator";
        }

        return { status: responseStatus, message: responseResult };
    }
}

module.exports = api;