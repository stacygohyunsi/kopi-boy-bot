const redis = require('redis');
const redisConfig = require('./redis');

describe('KopiBoy::Redis', () => {
	it('can make a connection to a Redis server', (done) => {
		let redisClient;
		if(process.env.IS_HEROKU) {
			redisClient = redis.createClient(config.urlString);
		} else if(process.env.IS_CODESHIP) {
			redisClient = redis.createClient(redisConfig.port, redisConfig.host);
		} else {
			redisClient = redis.createClient(redisConfig.port, redisConfig.host);
		}
		redisClient.on('ready', done);
	});
});