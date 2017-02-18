const provider = require('redis');
const providerConfig = require('../config/redis');

const analytics = require('./analytics');
const Strings = require('./strings');

let client;

const Cache = {
	get: function() {
		client = (process.env.IS_HEROKU) ?
			provider.createClient(providerConfig.urlString)
			: provider.createClient(providerConfig.port, providerConfig.host);
		client.on("error", (err) => {
			analytics.sendEvent(Strings.SYSTEM.error('Cache'));
			console.error("Error " + err);
		});
		return client;
	}
}

module.exports = Cache;