const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = (req, res, next) => {
    try {
        if (req.session && req.session.loggedInToken) {
            const decodedAccessToken = jwt.verify(req.session.loggedInToken, config.JWTSecret);
            req.loggedInUser = decodedAccessToken;
            next();
        }
        else {
            throw "Authorization error";
        }
    }
    catch(error) {
        return res.status(401).send('This request requires authorization');
    }
}