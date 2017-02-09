const TelegramConfig = require('../config/telegram');
const Notify = require('../components/notify');

(TelegramConfig.notificationBotToken && TelegramConfig.chatId) && (() => {
	const message = process.argv.slice(2).toString().replace(/,/gi, ' ');
	Notify('telegram', message, {
		chatId: TelegramConfig.chatId,
		token: TelegramConfig.notificationBotToken
	});
})();
