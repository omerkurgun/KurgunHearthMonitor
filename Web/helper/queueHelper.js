class queueHelperFunc {
    constructor () {
        this.amqplib = require('amqplib/callback_api');
        this.config = require('../config.json');

    }

    async sendToQueue (queueName, queueData) {

        let promiseSendToQueue = new Promise((resolve, reject) => {

            if (queueName) {

                if (queueData) {
                    
                    this.amqplib.connect(this.config.RabbitMQUrl, (err, conn) => {

                        if (!err) {

                            conn.createChannel((errTwo, channel) => {

                                if (!errTwo) {
                                    
                                    channel.assertQueue(queueName, {
                                        durable: false
                                    }, (errThree, assert) => {

                                        if (!errThree) {

                                            let queueStatus = channel.sendToQueue(queueName, Buffer.from(queueData));
    
                                            if (queueStatus) {
                                                resolve(queueName + " queue send successfully :)");
                                            }
                                            else {
                                                resolve(queueName + " queue send error :(");
                                            }

                                        }
                                        else {
                                            resolve(errThree);
                                        }

                                    });

                                }
                                else {
                                    resolve(errTwo);
                                }                              

                            });
                            
                            setTimeout(function () {
                                conn.close();
                            }, 500);

                        }
                        else {
                            resolve(err);
                        }

                    });

                }
                else {
                    resolve("Queue Data is required!");
                }

            }
            else {
                resolve("Queue Name is required!");
            }

        });

        return await promiseSendToQueue;

    }

}

module.exports = queueHelperFunc;