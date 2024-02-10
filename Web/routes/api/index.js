var express = require('express');
var checkAuthApi = require('../../helper/api/checkAuthApi');
var bodyParserJSON = require('../../helper/bodyParserJSON');
var router = express.Router();

const api = require('../../controller/api/api');

const apiController = new api();

router.get('/', function(req, res, next) {
  res.render('api/index', { title: 'Express' });
});

//Login
router.route('/login')
.get(bodyParserJSON, async (req, res, next) => {
    var resMessage = "";
    var result = await apiController.login(req.query.email, req.query.pass);
    resMessage = result;
    res.send(resMessage);
});

//Get Data With Token
router.route('/loginWithToken')
.get(bodyParserJSON, checkAuthApi, async (req, res, next) => {
    res.send(req.loggedInUserModel);
});

module.exports = router;