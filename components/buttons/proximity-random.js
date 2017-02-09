const Actions = require('../actions');
const Features = require('../features');
const Strings = require('../strings');

function ProximityRandomButtons() {
	const responseButtons = [];
	if(Features.WITHIN_PROXIMITY_RANDOM() === true) {
		responseButtons.push({
			payload: Actions.WITHIN_PROXIMITY_RANDOM,
			title: Strings.WITHIN_PROXIMITY_RANDOM,
			type: 'postback',
		});
	}
	if(Features.WITHIN_COUNTRY_RANDOM() === true) {
		responseButtons.push({
			payload: Actions.WITHIN_COUNTRY_RANDOM,
			title: Strings.WITHIN_COUNTRY_RANDOM,
			type: 'postback',
		});
	}
	return responseButtons;
}

module.exports = ProximityRandomButtons;