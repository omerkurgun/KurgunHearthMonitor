var mongoose = require("mongoose");
const config = require("../config.json");

module.exports = () => {
    mongoose.connect(config.MongoDBConn, { useNewUrlParser: true,  useUnifiedTopology: true });

    mongoose.connection.on('open', () => {
      console.log('MongoDB: Connected');
    });
    mongoose.connection.on('error', (err) => {
      console.log('MongoDB: Error', err);
    });

    mongoose.Promise = global.Promise;
}