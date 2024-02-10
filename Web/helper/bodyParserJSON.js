var bodyParser = require('body-parser');

var parseForm = bodyParser.urlencoded({ extended: false });
var parseFormJson = bodyParser.json();

var parseParam = [parseForm, parseFormJson];

module.exports = parseParam;