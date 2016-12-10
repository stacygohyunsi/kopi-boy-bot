const express = require("express");
var firebase = require('firebase');

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

router.get("/orders", function(req, res, next){ 
	var db = firebase.database();
	firebase.database.enableLogging(true)
	var ref = db.ref("/orders");
	ref.once("value", function(snapshot) {
		res.send(snapshot.val());
	});
});

exports.router = router;
module.exports = exports;