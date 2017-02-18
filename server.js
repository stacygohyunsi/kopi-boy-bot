require('newrelic');
// const apiAiConfig = require('./api.ai.config');
// const http = require('http');
// const path = require("path");
// const superagent = require('superagent');
// const moment = require('moment');
const express = require('express');
const path = require('path');
const Bot = require('messenger-bot');

const Cache = require('./components/cache').get();
const Actions = require('./components/actions');
const Utterance = require('./components/utterance');

const CafeRandomActions = require('./components/actions/cafe-random');
const WithinCountryActions = require('./components/actions/within-country');
const WithinProximityActions = require('./components/actions/within-proximity');
const OtherActions = require('./components/actions/other');
const analytics = require('./components/analytics');

const TelegramConfig = require('./config/telegram');
const Notify = require('./components/notify');

const app = express();

/** CONFIG */
process.env.PORT = process.env.PORT || 8080;
const config = {
  development: {
    token: process.env.TOKEN,
    verify: process.env.VERIFY,
    app_secret: process.env.APP_SECRET
  },
  production: {
    token: process.env.facebook_token,
    verify: process.env.verification_token,
    app_secret: process.env.facebook_app_secret
  },
};

// const firebaseDbRef = require('./components/firebase');

const bot = new Bot(config[process.env.NODE_ENV]);

const postbackHandlers = {
	[Actions.CAFE_RANDOM]: CafeRandomActions.handle,

	[Actions.WITHIN_COUNTRY_RANDOM]: WithinCountryActions.handleRandom,
	[Actions.WITHIN_COUNTRY_RANDOM_REPEAT]: WithinCountryActions.handleRandomRepeat,
	[Actions.WITHIN_PROXIMITY_RANDOM_REPEAT]: WithinProximityActions.handleRandomRepeat,
	[Actions.WITHIN_PROXIMITY_RANDOM]: WithinProximityActions.handleRandom,
	[Actions.WITHIN_200M_RANDOM]: WithinProximityActions.handle200mRandom,
	[Actions.WITHIN_500M_RANDOM]: WithinProximityActions.handle500mRandom,
	[Actions.WITHIN_2KM_RANDOM]: WithinProximityActions.handle2kmRandom,
	[Actions.WITHIN_NEVERMIND]: WithinProximityActions.handleNevermind
};

bot.on('postback', (payload, reply) => {
	console.log('postback incoming');
	const action = payload.postback.payload;
	Cache.get(payload.sender.id, function(err, resp) {
			resp = resp ? JSON.parse(resp) : [];
			if (Array.isArray(resp)) {
				resp.push(action);
				Cache.set(payload.sender.id, JSON.stringify(resp));
			}
	});
	bot.getProfile(payload.sender.id, (err, profile) => {
		const label = payload.postback.payload;
		const handler = postbackHandlers[action];
		const clientId = payload.sender.id;
		Object.assign(profile, { sender: payload.sender });
		handler ? handler(reply, profile) : OtherActions.handleUnknown();
		analytics.sendEvent(action, label, clientId, function(err) {
			if (err) { console.log("ERR", err) };
		});
	});
});

bot.on('message', (payload, reply) => {
	console.log("message");
	const isText = (typeof payload.message.text !== 'undefined')
	const isAttachments = (typeof payload.message.attachments !== 'undefined');

	if(isText) {
		Utterance.handleText(bot, reply, payload.sender.id);
	} else if(isAttachments) {
		bot.getProfile(payload.sender.id, (err, profile) => {
			if (err) { console.log("ERR", err) };
			const { attachments } = payload.message;
			attachments.forEach(attachment => {
				if(attachment.type === 'location') {
					const { coordinates } = attachment.payload;
					Utterance.handleLocation(reply, profile, coordinates, () => {
						reply('It\'s coming soon!');
					});
				}
			});
		});
	}
});

bot.on('error', (err) => {
  console.log(err.message);
});

app.use("/fbbot", bot.middleware());
app.use("/_coverage", express.static(path.resolve('./coverage/lcov-report')));

if (process.env.NODE_ENV === "development") {
	app.use("/", require("./config/details.js"));
}

/** ADMIN INTERFACE */
// app.use("/bower_components",express.static("bower_components")); // Shared libraries
// app.use("/resources",express.static("resources")); // Shared libraries

/** API */
// app.use("/api", require("./api"));
// app.use("/",express.static("display"));
// app.get(['/','/*', '/**'], function(req, res) {
//   res.sendFile(path.join(__dirname, '/display/index.html'));
// });

(TelegramConfig.notificationBotToken && TelegramConfig.chatId) && (() => {
	const message = `Good day, commanders. KopiBoy has just started in \`${process.env.NODE_ENV}\` environment.`;
	Notify('telegram', message, {
		chatId: TelegramConfig.chatId,
		token: TelegramConfig.notificationBotToken
	});
})();

app.listen(process.env.PORT);
console.log(`Kopiboy bot server running at port ${process.env.PORT}.`);