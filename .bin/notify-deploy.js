const TelegramConfig = require('../config/telegram');
const Notify = require('../components/notify');

(TelegramConfig.notificationBotToken && TelegramConfig.chatId) && (() => {
	const message = 'KopiBoy build and test process succeeded in CodeShip! Deploying to Heroku now.';
	Notify('telegram', message, {
		chatId: TelegramConfig.chatId,
		token: TelegramConfig.notificationBotToken
	});
})();
