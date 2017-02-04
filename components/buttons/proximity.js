const Actions = require('../actions');
const Features = require('../features');
const Strings = require('../strings');

function ProximityButtons() {
	const responseButtons = [];
	if(Features.WITHIN_COUNTRY() === true) {
		responseButtons.push({
			payload: Actions.WITHIN_COUNTRY,
			title: Strings.WITHIN_COUNTRY,
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