const Actions = require('../actions');
const Features = require('../features');
const Strings = require('../strings');

function ProximityButtons() {
	const responseButtons = [];
	if(Features.WITHIN_COUNTRY_RANDOM() === true) {
		responseButtons.push({
			payload: Actions.WITHIN_COUNTRY_RANDOM,
			title: Strings.WITHIN_COUNTRY_RANDOM,
			type: 'postback',
		});
	}
	if(Features.WITHIN_NEARBY() === true) {
		responseButtons.push({
			payload: Actions.WITHIN_NEARBY,
			title: Strings.WITHIN_NEARBY,
			type: 'postback',
		});
	}
	return responseButtons;
}

module.exports = ProximityButtons;