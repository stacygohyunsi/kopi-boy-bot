const Strings = require('./strings');
// const analytics = require('./analytics');
// const WelcomeButtons = require('./buttons/welcome');
const CafeRandomActions = require('./actions/cafe-random');
const Cache = require('./cache');
const Models = require('../models');
const WithinProximityAction = require('./actions/within-proximity');

const {
	sendCafe,
	sendErrorMessage
} = require('./actions/utility');
const {
	getLatitudeBounds,
	getLongitudeBounds
} = require('./location-calculator');

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

		const senderFacebookId = profile.sender.id;
		const latitude = coordinates.lat;
		const longitude = coordinates.long;

		Cache.setLastKnownLocation(senderFacebookId, latitude, longitude, (err, info) => {
			Utterance.handleCafeWithDistance(reply, profile, latitude, longitude);
		});
	}, 
	handleCafeWithDistance: function(reply, profile, latitude, longitude) {
		Cache.getLastDistanceSelection(profile.sender.id, (err, resp) => {
			if (err) {console.log(err);}
			console.log(resp);
			var proximity = resp;				
			let latitudeBounds;
			let longitudeBounds;
			if (proximity !== null) {
				latitudeBounds = getLatitudeBounds({ latitude, longitude }, proximity);
				longitudeBounds = getLongitudeBounds({ latitude, longitude }, proximity);
			}
			if (typeof latitudeBounds === 'undefined' || typeof longitudeBounds === 'undefined') {
				sendErrorMessage(reply, new Error(`Latitude and Longitude not defined for ${profile.sender.id}`));
			} else {
				Models.places.getOneWithinBounds(latitudeBounds, longitudeBounds).then((res) => {
					if(res === null) {
						reply({	text: 'We couldn\'t find any cafes within your specified location ):' });
						WithinProximityAction.handleRandom(reply, profile, ()=> {

						});
					} else {
						reply({ text: Strings.SUCCESS.cafeFound(profile.first_name) });
						sendCafe(reply, res.dataValues);
					}
				}).catch(err => {
					sendErrorMessage(reply, err);
				});
			}
		})
	}
};

module.exports = Utterance;