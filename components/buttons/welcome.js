const Actions = require('../actions');
const Features = require('../features');
const Strings = require('../strings');

function WelcomeButtons() {
	const responseButtons = [];
	if(Features.cafeRandom() === true) {
		responseButtons.push({
			payload: Actions.CAFE_RANDOM,
			title: Strings.CAFE_RANDOM,
			type: 'postback',
		});
	}
	if(Features.cafeList() === true) {
		responseButtons.push({
			payload: Actions.CAFE_LIST,
			title: Strings.CAFE_LIST,
			type: 'postback',
		});
	}
	if(Features.cafeAdd() === true) {
		responseButtons.push({
			payload: Actions.CAFE_ADD,
			title: Strings.CAFE_ADD,
			type: 'postback',
		});
	}
	return responseButtons;
}

module.exports = WelcomeButtons;