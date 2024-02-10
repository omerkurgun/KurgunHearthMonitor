const jwt = require('jsonwebtoken');
const config = require('../../config.json');

module.exports = (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(" ")[1];
        const decodedAccessToken = jwt.verify(accessToken, config.JWTSecret);
        req.loggedInUserModel = decodedAccessToken;
        next();
    }
    catch(error) {
        return res.status(401).send({
            status: false,
            message: 'This request requires authorization'
        });
    }
}