var db = require('../../helper/db')();

const amqplib = require('amqplib/callback_api');
const config = require('../../config.json');
const uuid = require('uuid');

const sendmailqueue = require('../../models/sendmailqueue');

const sendMail = require('../../helper/sendMailFunc');
const sendMailFunc = new sendMail();

async function TaskSendEmail (msg) {

    let promiseSendMailConsumer = new Promise(async (resolve, reject) => {

        if (msg) {
            let msgContentIdU = msg.content.toString();

            if (uuid.validate(msgContentIdU)) {
    
                try {
                    let result = await sendmailqueue.findOne({ idU: msgContentIdU, status: 1 });

                    if (result) {
    
                        sendMailFunc.sendMailWithSMTP(result.from, result.to, result.subject, result.html).then(async sendResult => {
                            
                            if (!sendResult.error) {
                                
                                try {
                                    
                                    await sendmailqueue.updateOne(
                                        { idU: result.idU }, 
                                        { updateDateStamp: new Date().getTime(), status: 2 },
                                        { upsert: false, multi: false }
                                    );

                                    resolve({ error: false });

                                } catch (error) {
                                    resolve({ error: true });
                                }
                                
                            }
                            else {
                                
                                try {
                                    await sendmailqueue.updateOne(
                                        { idU: result.idU }, 
                                        { updateDateStamp: new Date().getTime(), status: 3 },
                                        { upsert: false, multi: false }
                                    );

                                    resolve({ error: false });

                                } catch (error) {
                                    resolve({ error: true });
                                }
                                
                            }
    
                        });
                        
                    }
                    else {
                        
                        resolve({ error: true });

                    }

                } catch (error) {
                    resolve({ error: true });
                }

            }
            else {
    
                resolve({ error: true });
    
            }
        }
        else {
            resolve({ error: true });
        }

    });

    return await promiseSendMailConsumer;

}

amqplib.connect(config.RabbitMQUrl, (err, conn) => {

    if (!err) {
        
        conn.createChannel((errTwo, channel) => {

            if (!errTwo) {

                channel.assertQueue(config.QueueNames.SendMailQueue, {
                    durable: false
                }, (errThree, assert) => {

                    if (!errThree) {

                        channel.consume(config.QueueNames.SendMailQueue, async (msg) => await TaskSendEmail(msg));

                    }

                });

            }

        });

    }

});