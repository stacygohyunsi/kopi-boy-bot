const express = require("express");
const firebase = require('firebase');
const firebaseConfig = require('../firebase.config');

var exports = {};
var router = express.Router();

firebase.initializeApp(firebaseConfig[process.env.NODE_ENV]);
var db = firebase.database();
// firebase.database.enableLogging(true);

router.get("/orders", function(req, res, next){ 
	// refOrders.on("value", function(snapshot) {
	// 	var orders = snapshot.val();
	// 	var requestCount = 0;

	// 	async.whilst(    
	// 		function () { 
	// 				return requestCount < Object.keys(orders).length; 
	// 		},function (callback) {
	// 			var customer = orders[Object.keys(orders)[requestCount]].customer;
	// 			refCustomers.child(customer).once('value', function(customerDetails) {
	// 					orders[Object.keys(orders)[requestCount]].customerDetails = customerDetails.val();
	// 					requestCount++;
	// 					callback();
	// 			});			
	// 		}, 
	// 		function (err) {
	// 				console.log(err);
	// 				res.send(orders);
	// 		}
	// 	);
	// });
});

exports.router = router;
module.exports = exports;