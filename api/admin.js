const express = require("express");

var exports = {};
var router = express.Router();

router.get("/orders", function(req, res, next){  
	res.send("yay");
});

exports.router = router;
module.exports = exports;