const express = require("express");
var firebase = require('firebase');
var async = require('async');

var exports = {};
var router = express.Router();

const config = {
  development: {
		apiKey: "AIzaSyAr-GmcfRJkiiOYau8zlUQYXTs8lBqGCiw",
		authDomain: "kopiboyapp-6a596.firebaseapp.com",
		databaseURL: "https://kopiboyapp-6a596.firebaseio.com",
		storageBucket: "kopiboyapp-6a596.appspot.com"
  },
  production: {
    apiKey: process.env.firebase_api_key,
    authDomain: process.env.firebase_auth_domain,
    databaseURL: process.env.firebase_database_URL, 
		storageBucket: process.env.firebase_storage_bucket
  },
}

firebase.initializeApp(config[process.env.NODE_ENV]);
var db = firebase.database();
// firebase.database.enableLogging(true);
var refCustomers = db.ref("/customers");
var refOrders = db.ref("/orders");

router.get("/orders", function(req, res, next){ 
	refOrders.once("value", function(snapshot) {
		var orders = snapshot.val();
		var requestCount = 0;

		async.whilst(    
			function () { 
					return requestCount < Object.keys(orders).length; 
			},function (callback) {
				var customer = orders[Object.keys(orders)[requestCount]].customer;
				refCustomers.child(customer).once('value', function(customerDetails) {
						orders[Object.keys(orders)[requestCount]].customerDetails = customerDetails.val();
						requestCount++;
						callback();
				});			
			}, 
			function (err) {
					console.log(err);
					res.send(orders);
			}
		);
	});
});

exports.router = router;
module.exports = exports;