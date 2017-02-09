const ProximityRandomButtons = require('../buttons/proximity-random');
const Strings = require('../strings');

const ActionsCafeRandom = {
	handle: function(reply, profile, callback) {
		const responseText = Strings.CAFE_RANDOM_ABOUT;
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
	}
};

module.exports = ActionsCafeRandom;