const express = require("express");

var exports = {};
var router = express.Router();
var status;
exports.router = router;

router.get("/orders", function(req, res){  
	res.send("yay");
});


module.exports = exports;