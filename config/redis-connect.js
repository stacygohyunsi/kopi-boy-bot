const redis = require('redis');
const redisConfig = require('./redis');
let client = null;

const redisConnect = function() {

if(process.env.IS_HEROKU) {
		client = redis.createClient(redisConfig.urlString);
	} else {
		client = redis.createClient(redisConfig.port, redisConfig.host);
	}

	client.on("error", (err)=> {
		console.log("ERR " + err);
	});

	return client;
};

module.exports = redisConnect;
