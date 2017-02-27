const Analytics = require('../analytics');
const ProximityRandomButtons = require('../buttons/proximity-random');
const Strings = require('../strings');

const CafeRandomActions = {
	handle: function(reply, profile, callback) {
		(!reply) && (() => { throw new Error('Expected parameter `reply` could not be found.'); })();
		(!profile) && (() => { throw new Error('Expected parameter `profile` could not be found.'); })();

		const clientId = profile.id;
		const name = `${profile.first_name}`;
		const responseText = Strings.CAFE_RANDOM_ABOUT.replace(Strings.KEYS.NAME, name);
		const responseButtons = ProximityRandomButtons();
		Analytics.sendEvent("Actions::CafeRandom", clientId, clientId, function(err) {
			(err) && console.error("ERROR", err);
		});
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
			(callback) ? callback(err, info) : (() => {
				(err) && console.error(err);
				(!err) && console.info
			})();
		});
	}
};

module.exports = CafeRandomActions;