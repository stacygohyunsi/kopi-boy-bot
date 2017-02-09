const Actions = require('./index');
const Strings = require('../strings');

const ProximityRandomButtons = require('../buttons/proximity-random');

const {
	generateListTemplateType,
	generatePostbackButton,
	generateTemplateAttachment
} = require('./utility');

const WithinProximityAction = {
	generateMessageElement: function(name) {
		return {
			title: `So, ${name || 'dear user'}, an Adventure!`,
			image_url: 'https://scontent-sit4-1.xx.fbcdn.net/v/t1.0-9/16508075_742760355874278_8508412211420611200_n.png?oh=af5c4b5876ce0e2145eaaf06a33db37d&oe=590FF3FE'
		};
	},

	generate200mElement: function() {
		return {
			title: `Really Nearby`,
			subtitle: 'Within a 5 minute walk from where you are.',
			buttons: [
				generatePostbackButton(Actions.WITHIN_200M_RANDOM, Strings.WITHIN_200M_RANDOM)
			]
		};
	},

	generate500mElement: function() {
		return {
			title: `Slightly Further`,
			subtitle: 'Within a 15 minute walk from where you are.',
			buttons: [
				generatePostbackButton(Actions.WITHIN_500M_RANDOM, Strings.WITHIN_500M_RANDOM)
			]
		};
	},

	generate2kmElement: function() {
		return {
			title: `Even Further`,
			subtitle: 'Within a 30 minutes walk or 5 minute drive from where you are.',
			buttons: [
				generatePostbackButton(Actions.WITHIN_2KM_RANDOM, Strings.WITHIN_2KM_RANDOM)
			]
		};
	},

	createReply: function(name) {
		const payload = generateListTemplateType(
			[
				WithinProximityAction.generateMessageElement(name),
				WithinProximityAction.generate200mElement(),
				WithinProximityAction.generate500mElement(),
				WithinProximityAction.generate2kmElement()
			], [
				generatePostbackButton(Actions.WITHIN_NEVERMIND, Strings.WITHIN_NEVERMIND)
			]
		);
		
		return generateTemplateAttachment(payload);
	},

	handle200mRandom: function(reply, profile, callback) {
		reply({ text: `It's coming soon, ${profile.first_name}! Hold it in there~` });
	},

	handle500mRandom: function(reply, profile, callback) {
		reply({ text: `It's coming soon, ${profile.first_name}! Hold it in there~` });
	},

	handle2kmRandom: function(reply, profile, callback) {
		reply({ text: `It's coming soon, ${profile.first_name}! Hold it in there~` });
	},

	handleNevermind: function(reply, profile, callback) {
		(!reply) && (() => { throw new EvalError('Required parameter `reply` was not found.'); })();
		(!profile) && (() => { throw new EvalError('Required parameter `profile` was not found.'); })();
		const responseText = 'Sure, let\'s find you cafés:';
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
	},

	handleRandom: function(reply, profile, callback) {
		(!reply) && (() => { throw new EvalError('Required parameter `reply` was not found.'); })();
		(!profile) && (() => { throw new EvalError('Required parameter `profile` was not found.'); })();

		const name = profile ? profile.first_name : 'dear user';

		reply(WithinProximityAction.createReply(name), (err, info) => {
			(callback) ? callback(err, info) : (() => { })();
		});
	}
};

module.exports = WithinProximityAction;