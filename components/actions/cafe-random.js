const ProximityButtons = require('../buttons/proximity');
const Strings = require('../strings');

const ActionsCafeRandom = {
	handle: function(reply, profile, callback) {
		const responseText = Strings.CAFE_RANDOM_ABOUT;
		const responseButtons = ProximityButtons();
		console.log(responseText);
		console.log(responseButtons);
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
				console.log(err);
				console.log(info);
			})();
		});
	}
};

module.exports = ActionsCafeRandom;