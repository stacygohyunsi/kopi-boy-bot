const ACTIONS = require('../../actions');
const FEATURES = require('../../features');
const STRINGS = require('../../strings');

function WelcomeButtons() {
	const responseButtons = [];
	if(FEATURES.WITHIN_NEARBY === true) {
		responseButtons.push({
			payload: ACTIONS.WITHIN_NEARBY,
			title: STRINGS.WITHIN_NEARBY,
			type: 'postback',
		});
	}
	if(FEATURES.WITHIN_COUNTRY === true) {
		responseButtons.push({
			payload: ACTIONS.WITHIN_COUNTRY,
			title: STRINGS.WITHIN_COUNTRY,
			type: 'postback',
		});
	}
	return responseButtons;
}

module.exports = WelcomeButtons;