var db = require('../../helper/db')();

const config = require('../../config.json');

const sendmailqueue = require('../../models/sendmailqueue');

const queueHelper = require('../../helper/queueHelper');

const queueHelperFunc = new queueHelper();

async function SendToQueue (mailData) {

    let promiseSendToQueue = new Promise((resolve, reject) => {

        if (mailData.status == 3) {

            sendmailqueue.updateOne(
                { idU: mailData.idU }, 
                { updateDateStamp: new Date().getTime(), status: 1 },
                { upsert: false, multi: false }
            ).then(() => {
                
                queueHelperFunc.sendToQueue(config.QueueNames.SendMailQueue, mailData.idU).then((result) => {
            
                    resolve({ error: false });
                    
                }).catch((err) => {

                    resolve({ error: true });

                });

            });

        }
        else {

            queueHelperFunc.sendToQueue(config.QueueNames.SendMailQueue, mailData.idU).then((result) => {
            
                resolve({ error: false });
                
            }).catch((err) => {

                resolve({ error: true });

            });

        }

    });

    return await promiseSendToQueue;

}

async function FindAndSend() {
   
    let resultList = await sendmailqueue.find({ status: { $in: [1, 3] } });
    if (resultList) 
        resultList.forEach(async (mailData) => await SendToQueue(mailData));

}

FindAndSend();