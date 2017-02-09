var express = require("express");

var exports = {};
var router = express.Router();
exports.router = router;

router.get('/', function(req, res, next) {
	res.sendFile('./details.html', {root: __dirname })
})

module.exports = router;

