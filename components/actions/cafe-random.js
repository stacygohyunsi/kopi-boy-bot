const analytics = require('../analytics');
const ProximityRandomButtons = require('../buttons/proximity-random');
const Strings = require('../strings');

const CafeRandomActions = {
	handle: function(reply, profile, callback) {
		const clientId = profile.id;
		const name = `${profile.first_name}`;
		const responseText = Strings.CAFE_RANDOM_ABOUT.replace(Strings.KEYS.NAME, name);
		const responseButtons = ProximityRandomButtons();
		analytics.sendEvent("welcome", clientId, clientId, function(err) {
			if (err) { console.error("ERR", err); };
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
			(callback) ? callback(err, info) : (() => { })();
		});
	}
};

module.exports = CafeRandomActions;