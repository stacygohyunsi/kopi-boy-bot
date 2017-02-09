const TelegramConfig = require('../config/telegram');
const Notify = require('../components/notify');

(TelegramConfig.notificationBotToken && TelegramConfig.chatId) && (() => {
	const message = 'KopiBoy build and test process started in CodeShip!';
	Notify('telegram', message, {
		chatId: TelegramConfig.chatId,
		token: TelegramConfig.notificationBotToken
	});
})();
