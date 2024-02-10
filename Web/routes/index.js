var express = require('express');
var router = express.Router();

/* GET home page. and show the Main Section */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;