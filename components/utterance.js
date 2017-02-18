const Strings = require('./strings');
// const analytics = require('./analytics');
// const WelcomeButtons = require('./buttons/welcome');
const CafeRandomActions = require('./actions/cafe-random');
const Cache = require('./cache');

const {
	generateTemplateAttachment
} = require('./actions/utility');

const Utterance = {
	handleText: function(bot, reply, senderMessengerId) {
		(!bot) && (() => { throw new Error('Required parameter `bot` was not found.') })();
		(!reply) && (() => { throw new Error('Required parameter `reply` was not found.') })();
		(!senderMessengerId) && (() => { throw new Error('Required parameter `senderMessengerId` was not found.') })();

		bot.getProfile(senderMessengerId, (err, profile) => {
			const clientId = senderMessengerId;
			// const name = `${profile.first_name} ${profile.last_name}`;
			// const text = Strings.WELCOME.replace(Strings.KEYS.NAME, name);
			Object.assign(profile, { id: clientId });
			CafeRandomActions.handle(reply, profile, (err, info) => {
				if(err) { console.error(err); }
				else { console.info(info); }
			});
			/*const buttons = WelcomeButtons();
			analytics.sendEvent("welcome", clientId, clientId, function(err) {
				if (err) {console.log("ERR", err)};
			});
			reply(generateTemplateAttachment({
				template_type: 'button',
				text, buttons
			}), err => {
				if(err) { console.log(err); }
			});*/
		});
	}, 
	handleLocation: function (reply, profile, coordinates, callback) {
		(!reply) && (() => { throw new EvalError('Required parameter `reply` was not found.'); })();
		(!profile) && (() => { throw new EvalError('Required parameter `profile` was not found.'); })();
		(!coordinates) && (() => { throw new EvalError('Required parameter `coordinates` was not found.'); })();
	
		Cache.get(profile.sender.id + ".actions", function(err, resp) {
			if (err) {console.log("ERR", err);}
			const actionsArray = JSON.parse(resp);
			const locationAction = actionsArray[actionsArray.length - 1];

			Cache.set(profile.sender.id + ".lastLocation", JSON.stringify(coordinates));
			Cache.set(profile.sender.id + ".locationAction", JSON.stringify(locationAction));
			
			const proximities = {
				WITHIN_200M_RANDOM: 200,
				WITHIN_500M_RANDOM: 500,
				WITHIN_2KM_RANDOM: 2000
			}

			const proximity = proximities[locationAction] ? proximities[locationAction] : null;
			let latitudes;
			let longitudes;
			// console.log(coordinates);
			if (proximity !== null) {
				latitudes = distance.getLatitudeBounds({ latitude:coordinates.lat, longitude:coordinates.long }, proximity);
				longitudes = distance.getLongitudeBounds({ latitude:coordinates.lat, longitude:coordinates.long }, proximity);
				// console.log(latitudes);
				// console.log(longitudes);
			}
			let text;
			if (typeof latitudes === 'undefined' || typeof longitudes === 'undefined') {
				text = 'Oops, something went wrong with my internals, and my creators have been notified so I\'ll be fixed soon. Apologies for the inconvenience.';
				reply({ text });
			} else {
				Models.places.find({
					where: {
						$and: [
							{ latitude: { $gt: latitudes.lowerLatitude } },
							{ latitude: { $lt: latitudes.upperLatitude } },
							{ longitude: { $gt: longitudes.leftLongitude } },
							{ longitude: { $lt: longitudes.rightLongitude } }
						]
					},
					order: [ Sequelize.fn('RAND') ]
				}).then((res) => {
					if(res === null) {
						reply({
							text: 'We couldn\'t find any cafes within your specified location ):'
						});
						WithinProximityAction.handleRandom(reply, profile, callback);
					} else {
						const { dataValues } = res;
						const name = profile.first_name;
						const leadText = Strings.SUCCESS.cafeFound(name);
						reply({ text: leadText });
						console.log(dataValues);
						setTimeout(() => {
							reply(WithinProximityAction.generateReply(dataValues), (err, info) => {
								(callback) ? callback(err, info) : (() => {
									console.log(err);
									console.log(info);
								})();
							});
						}, 500);
					}
				}).catch(err => {
					console.log(err);
					reply({
						text:'oops'
					});
				});
			}
		});
	}
};

module.exports = Utterance;