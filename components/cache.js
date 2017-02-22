const provider = require('redis');
const providerConfig = require('../config/redis');
const analytics = require('./analytics');
const Strings = require('./strings');

let client = null;

const Cache = {
	KEY_LAST_ACTION: 'lastAction',
	KEY_LAST_DISTANCE_SELECTION: 'lastDistanceSelection',
	KEY_LAST_KNOWN_LATITUDE: 'lastKnownLatitude',
	KEY_LAST_KNOWN_LONGITUDE: 'lastKnownLongitude',
	KEY_NAME: 'name',
	getUser: function(userId, callback) {
		client.hgetall(userId, (err, result) => {
			(callback) && callback(result);
		});
	},
	getLastAction: function(userId, callback) {
		client.hget(userId, Cache.KEY_LAST_ACTION, (err, result) => {
			(callback) && callback(result);
		});
	},
	getLastDistanceSelection: function(userId, callback) {
		client.hget(userId, Cache.KEY_LAST_DISTANCE_SELECTION, (err, result) => {
			if (err) {console.log("ERR", err)};
			(callback) && callback(err, result);
		});
	},
	getLastKnownLocation: function(userId, callback) {
		let tasks = 2;
		let lastKnownLocation = {
			latitude: null,
			longitude: null
		};
		const completed = (type) => {
			return ((err, result) => {
				lastKnownLocation[type] = result;
				(--tasks === 0) && (callback) && callback(lastKnownLocation)
			});
		};
		client.hget(userId, Cache.KEY_LAST_KNOWN_LATITUDE, completed('latitude'));
		client.hget(userId, Cache.KEY_LAST_KNOWN_LONGITUDE, completed('longitude'));
	},
	getUserName: function(userId, callback) {
		client.hget(userId, Cache.KEY_NAME, (err, result) => {
			(callback) && callback(result);
		});
	},
	setUser: function(userId, name, callback) {
		client.hmset(userId, Cache.KEY_NAME, name, (err, result) => {
			(callback) && callback(result);
		});
	},
	setLastAction: function(userId, actionId, callback) {
		client.hmset(userId, Cache.KEY_LAST_ACTION, actionId, (err, result) => {
			(callback) && callback(result);
		});
	},
	setLastDistanceSelection: function(userId, distance, callback) {
		client.hmset(userId, Cache.KEY_LAST_DISTANCE_SELECTION, distance, (err, result) => {
			if (err) {console.log("ERR", err)};
			(callback) && callback(result);
		});
	},
	setLastKnownLocation: function(userId, latitude, longitude, callback) {
		let tasks = 2;
		const completed = (err, result) => (--tasks === 0) && (callback) && callback(result);
		client.hset(userId, Cache.KEY_LAST_KNOWN_LATITUDE, latitude, completed);
		client.hset(userId, Cache.KEY_LAST_KNOWN_LONGITUDE, longitude, completed);
	},
	get: function() {
		if(client === null) {
			client = (process.env.IS_HEROKU) ?
				provider.createClient(providerConfig.urlString)
				: provider.createClient(providerConfig.port, providerConfig.host);
			client.on("error", (err) => {
				analytics.sendEvent(Strings.SYSTEM.error('Cache'));
				console.error('ERR:' + err);
			});
		}
		return client;
	}
}

module.exports = Cache;