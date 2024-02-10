class sendMailFunc {
    constructor() {
        this.sendmailqueue = require('../models/sendmailqueue');
        this.uuid = require('uuid');
        this.config = require('../config.json');
        const queueHelper = require('../helper/queueHelper');
        this.queueHelper = new queueHelper();
        
        this.nodemailer = require('nodemailer');
        
        this.transporterGmail = this.nodemailer.createTransport({
          host: this.config.SMTPSettings.Host,
          port: this.config.SMTPSettings.Port,
          secure: this.config.SMTPSettings.Secure,
          auth: {
            user: this.config.SMTPSettings.User,
            pass: this.config.SMTPSettings.Pass,
          }
        });
    }

    async sendMailWithSMTP(from, to, subject, html) {

        let promiseSendMailWithSMTP = new Promise((resolve, reject) => {

            if (from && to && subject && html) {

                this.transporterGmail.sendMail({ from: from, to: to, subject: subject, html: html }, (err, info) => {
                
                    if (!err) {
    
                        resolve({ error: false });
    
                    } 
                    else {
    
                        resolve({ error: true });
    
                    }
    
                });

            }
            else {

                resolve({ error: true });

            }

        });

        return await promiseSendMailWithSMTP;
    }
    
    async sendMailWithQueue(to, subject, html) {

        let promiseSendMail = new Promise((resolve, reject) => {
            let uID = this.uuid.v4();

            new this.sendmailqueue({
                idU: uID,
                createDateStamp: new Date().getTime(),
                from: this.config.ToEmail,
                to: to,
                subject: subject,
                html: html,
                status: 1
            }).save().then(() => {

                this.queueHelper.sendToQueue(this.config.QueueNames.SendMailQueue, uID).then((result) => {
                    
                    resolve({ error: false });
                    
                }).catch((err) => {

                    resolve({ error: false });

                });

            }).catch((err) => {

                resolve({ error: true });

            });
        });

        return await promiseSendMail;
    }
}

module.exports = sendMailFunc;
