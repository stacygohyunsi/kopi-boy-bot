const Sequelize = require('sequelize');

const redisConnect = require('../../redis-connect');
const Actions = require('./index');
const Models = require('../../models');
const Strings = require('../strings');
const distance = require('../location-calculator');

const ProximityRandomButtons = require('../buttons/proximity-random');

const {
	generateListTemplateType,
	generatePostbackButton,
	generateTemplateAttachment
} = require('./utility');


const WithinProximityAction = {
	generateMessageElement: function(name) {
		return {
			title: `So, ${name || 'dear user'}, an Adventure!`,
			image_url: 'https://scontent-sit4-1.xx.fbcdn.net/v/t1.0-9/16508075_742760355874278_8508412211420611200_n.png?oh=af5c4b5876ce0e2145eaaf06a33db37d&oe=590FF3FE'
		};
	},

	generate200mElement: function() {
		return {
			title: `Really Nearby`,
			subtitle: 'Within a 5 minute walk from where you are.',
			buttons: [
				generatePostbackButton(Actions.WITHIN_200M_RANDOM, Strings.WITHIN_200M_RANDOM)
			]
		};
	},

	generate500mElement: function() {
		return {
			title: `Slightly Further`,
			subtitle: 'Within a 15 minute walk from where you are.',
			buttons: [
				generatePostbackButton(Actions.WITHIN_500M_RANDOM, Strings.WITHIN_500M_RANDOM)
			]
		};
	},

	generate2kmElement: function() {
		return {
			title: `Even Further`,
			subtitle: 'Within a 30 minutes walk or 5 minute drive from where you are.',
			buttons: [
				generatePostbackButton(Actions.WITHIN_2KM_RANDOM, Strings.WITHIN_2KM_RANDOM)
			]
		};
	},

	createReply: function(name) {
		const payload = generateListTemplateType(
			[
				WithinProximityAction.generateMessageElement(name),
				WithinProximityAction.generate200mElement(),
				WithinProximityAction.generate500mElement(),
				WithinProximityAction.generate2kmElement()
			], [
				generatePostbackButton(Actions.WITHIN_NEVERMIND, Strings.WITHIN_NEVERMIND)
			]
		);

		return generateTemplateAttachment(payload);
	},

	handle200mRandom: function(reply, profile, callback) {
		reply({ text: `It's coming soon, ${profile.first_name}! Hold it in there~` });
	},

	handle500mRandom: function(reply, profile, callback) {
		reply({ text: `It's coming soon, ${profile.first_name}! Hold it in there~` });
	},

	handle2kmRandom: function(reply, profile, callback) {

		reply({ text: `Awesome, ${profile.first_name}, one last thing. Could you send me your location so I know where you are?` });

	},

	handleLocationReception: function (reply, profile, payload, coordinates, callback) {
		(!reply) && (() => { throw new EvalError('Required parameter `reply` was not found.'); })();
		(!profile) && (() => { throw new EvalError('Required parameter `profile` was not found.'); })();
		(!coordinates) && (() => { throw new EvalError('Required parameter `coordinates` was not found.'); })();

		redisConnect.get(payload.sender.id, function(err, resp) {
			if (err) {console.log("ERR", err);}
			const actionsArray = JSON.parse(resp);
			const locationAction = actionsArray[actionsArray.length - 1];
			const proximities = {
				WITHIN_200M_RANDOM: 200,
				WITHIN_500M_RANDOM: 500,
				WITHIN_2KM_RANDOM: 2000
			}
			const proximity = proximities[locationAction] ? proximities[locationAction] : null;
			if (proximity !== null) {
				const latitudes = distance.getLatitudeBounds({ latitude:coordinates.lat, longitude:coordinates.long }, proximity);
				const longitudes = distance.getLongitudeBounds({ latitude:coordinates.lat, longitude:coordinates.long }, proximity);
				console.log(latitudes);
				console.log(longitudes);
				Models.places.find({
					latitude: {
						$gt: latitudes.lowerLatitude,
						$lt: latitudes.upperLatitude
					},
					longitude: {
						$gt: longitudes.leftLongitude,
						$lt: longtiudes.rightLongtiude
					},
					order: [ Sequelize.fn('RAND') ]
				}).then((res) => {
					const { dataValues } = res;

					(callback) ? callback() : (() => {
						
					})();
				});
			} else {
				reply({
					text: 'Sorry, an error occurred and we could not find a café for you, we\'re terribly sorry.'
				})
			}
			//TODO: make query to the db to get the cafe
		});
	},

	handleNevermind: function(reply, profile, callback) {
		(!reply) && (() => { throw new EvalError('Required parameter `reply` was not found.'); })();
		(!profile) && (() => { throw new EvalError('Required parameter `profile` was not found.'); })();
		const responseText = 'Sure, let\'s find you cafés:';
		const responseButtons = ProximityRandomButtons();

		reply({
			attachment: {
				type: 'template',
				payload: {
					template_type: 'button',
					text: responseText,
					buttons: responseButtons
				}
			}
		}, (err, info) => {
			(callback) ? callback(err, info) : (() => { })();
		});
	},

	handleRandom: function(reply, profile, callback) {
		(!reply) && (() => { throw new EvalError('Required parameter `reply` was not found.'); })();
		(!profile) && (() => { throw new EvalError('Required parameter `profile` was not found.'); })();

		const name = profile ? profile.first_name : 'dear user';

		reply(WithinProximityAction.createReply(name), (err, info) => {
			(callback) ? callback(err, info) : (() => { })();
		});
	}
};

module.exports = WithinProximityAction;