const ACTIONS = require('../../actions');
const FEATURES = require('../../features');
const STRINGS = require('../../strings');

function WelcomeButtons() {
	const responseButtons = [];
	if(FEATURES.CAFE_RANDOM === true) {
		responseButtons.push({
			payload: ACTIONS.CAFE_RANDOM,
			title: STRINGS.CAFE_RANDOM,
			type: 'postback',
		});
	}
	if(FEATURES.CAFE_LIST === true) {
		responseButtons.push({
			payload: ACTIONS.CAFE_LIST,
			title: STRINGS.CAFE_LIST,
			type: 'postback',
		});
	}
	if(FEATURES.CAFE_ADD === true) {
		responseButtons.push({
			payload: ACTIONS.CAFE_ADD,
			title: STRINGS.CAFE_ADD,
			type: 'postback',
		});
	}
	return responseButtons;
}

module.exports = WelcomeButtons;