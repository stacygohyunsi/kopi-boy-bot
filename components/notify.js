const TelegramBot = require('node-telegram-bot-api');

const Notify = function(platform, message, options) {
	if(typeof Notify[platform] === 'undefined') {
		throw new EvalError(`Specified platform, '${platform}', does not exist.`);
	}
	return Notify[platform](message, options);
}

Notify.telegram = function(message, options) {
	(!options) && (() => { throw new EvalError('Required params `options` was not defined.') })();

	const bot = new TelegramBot(options.token, options);
	const messageToSend = message || '<raw ping>';
	(options.listen) ?
		bot.onText(/\/start/, function(msg) {
			bot.sendMessage(msg.chat.id, `The ID of this chat is: ${msg.chat.id}`);
		}) : bot.sendMessage(options.chatId, messageToSend, {
			parse_mode: options.parse_mode || 'Markdown'
		});
};

module.exports = Notify;
