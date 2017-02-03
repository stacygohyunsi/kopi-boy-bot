const Actions = require('../actions');
const Features = require('../features');
const Strings = require('../strings');

function WelcomeButtons() {
	const responseButtons = [];
	if(Features.withinNearby() === true) {
		responseButtons.push({
			payload: Actions.WITHIN_NEARBY,
			title: Strings.WITHIN_NEARBY,
			type: 'postback',
		});
	}
	if(Features.withinCountry() === true) {
		responseButtons.push({
			payload: Actions.WITHIN_COUNTRY,
			title: Strings.WITHIN_COUNTRY,
			type: 'postback',
		});
	}
	return responseButtons;
}

module.exports = WelcomeButtons;