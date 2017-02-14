const Strings = require('./strings');
const analytics = require('./analytics');
const WelcomeButtons = require('./buttons/welcome');
const {
	generateTemplateAttachment
} = require('./actions/utility');

const Utterance = {
	handleText: function(bot, reply, senderMessengerId) {
		(!bot) && (() => { throw new Error('Required parameter `bot` was not found.') })();
		(!reply) && (() => { throw new Error('Required parameter `reply` was not found.') })();
		(!senderMessengerId) && (() => { throw new Error('Required parameter `senderMessengerId` was not found.') })();

		bot.getProfile(senderMessengerId, (err, profile) => {
			const clientId = senderMessengerId;
			const name = `${profile.first_name} ${profile.last_name}`;
			const text = Strings.WELCOME.replace(Strings.KEYS.NAME, name);
			const buttons = WelcomeButtons();
			analytics.sendEvent("welcome", clientId, clientId, function(err) {
				if (err) {console.log("ERR", err)};
			});
			reply(generateTemplateAttachment({
				template_type: 'button',
				text, buttons
			}), err => {
				if(err) { console.log(err); }
			});
		});
	}
};

module.exports = Utterance;