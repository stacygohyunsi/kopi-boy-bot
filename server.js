require('newrelic');
// const apiAiConfig = require('./api.ai.config');
// const http = require('http');
// const path = require("path");
// const superagent = require('superagent');
// const moment = require('moment');
const express = require('express');
const path = require('path');
const Bot = require('messenger-bot');

const Strings = require('./components/strings');
const Actions = require('./components/actions');

const WelcomeButtons = require('./components/buttons/welcome');

const CafeRandomActions = require('./components/actions/cafe-random');
const WithinCountryActions = require('./components/actions/within-country');
const WithinProximityActions = require('./components/actions/within-proximity');
const OtherActions = require('./components/actions/other');
const analytics = require('./components/analytics');

const TelegramConfig = require('./config/telegram');
const Notify = require('./components/notify');

const {
	generateTemplateAttachment
} = require('./components/actions/utility');

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

	[Actions.WITHIN_PROXIMITY_RANDOM]: WithinProximityActions.handleRandom,
	[Actions.WITHIN_200M_RANDOM]: WithinProximityActions.handle200mRandom,
	[Actions.WITHIN_500M_RANDOM]: WithinProximityActions.handle500mRandom,
	[Actions.WITHIN_2KM_RANDOM]: WithinProximityActions.handle2kmRandom,
	[Actions.WITHIN_NEVERMIND]: WithinProximityActions.handleNevermind
};

bot.on('postback', (payload, reply) => {
	bot.getProfile(payload.sender.id, (err, profile) => {
		const action = payload.postback.payload;
		const label = payload.postback.payload;
		const handler = postbackHandlers[action];
		const clientId = payload.sender.id
		Object.assign(profile, { sender: payload.sender });
		handler ? handler(reply, profile) : OtherActions.handleUnknown();
		analytics.sendEvent(action, label, clientId, function(err) {
			if (err) { console.log("ERR", err) };
		});
	});
});

bot.on('message', (payload, reply) => {
  bot.getProfile(payload.sender.id, (err, profile) => {
		const clientId = payload.sender.id;
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
  })
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