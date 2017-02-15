const redis = require('redis');
const redisConfig = require('./config/redis');

const redisConnect = (function() {  
	
	// connect to REDIS
	let redisClient;

	if(process.env.IS_HEROKU) {
		redisClient = redis.createClient(redisConfig.urlString);
	} else {
		redisClient = redis.createClient(redisConfig.port, redisConfig.host);
	}

	redisClient.on("error", (err) => {
			console.log("Error " + err);
	});
	return redisClient;

})();
module.exports = redisConnect;