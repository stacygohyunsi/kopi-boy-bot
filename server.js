require('newrelic');
// const apiAiConfig = require('./api.ai.config');
// const http = require('http');
// const path = require("path");
// const superagent = require('superagent');
// const moment = require('moment');
const express = require('express');
const path = require('path');
const Bot = require('messenger-bot');

const Features = require('./components/features');
const Strings = require('./components/strings');
const Actions = require('./components/actions');

const WelcomeButtons = require('./components/buttons/welcome');
const ProximityRandomButtons = require('./components/buttons/proximity-random');

const CafeRandom = require('./components/actions/cafe-random');
const WithinCountryActions = require('./components/actions/within-country');
const WithinProximityActions = require('./components/actions/within-proximity');
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

bot.on('error', (err) => {
  console.log(err.message);
});

bot.on('postback', (payload, reply) => {
	bot.getProfile(payload.sender.id, (err, profile) => {
		Object.assign(profile, { sender: payload.sender });
		
		switch(payload.postback.payload) {
			case Actions.WITHIN_200M_RANDOM:
				WithinProximityActions.handle200mRandom(reply, profile);
				break;
			case Actions.WITHIN_500M_RANDOM:
				WithinProximityActions.handle500mRandom(reply, profile);
				break;
			case Actions.WITHIN_2KM_RANDOM:
				WithinProximityActions.handle2kmRandom(reply, profile);
				break;
			case Actions.WITHIN_PROXIMITY_RANDOM:
				WithinProximityActions.handleRandom(reply, profile);
				break;
			case Actions.WITHIN_COUNTRY_RANDOM:
				analytics.sendEvent("withinCountry","withinCountry", payload.sender.id, function(err, httpResponse) {
					if (err) {console.log("ERR", err)};
				}); 				
				WithinCountryActions.handleRandom(reply, profile);
				break;
			case Actions.WITHIN_COUNTRY_RANDOM_REPEAT:
				analytics.sendEvent("withinCountryRepeat","withinCountryRepeat", payload.sender.id, function(err, httpResponse) {
					if (err) {console.log("ERR", err)};
				}); 					
				WithinCountryActions.handleRandomRepeat(reply, profile);
				break;
			case Actions.CAFE_RANDOM:
				analytics.sendEvent("cafeRoulette","cafeRoulette", payload.sender.id, function(err, httpResponse) {
					if (err) {console.log("ERR", err)};
				}); 
				CafeRandom.handle(reply, profile);
				break;
			default:
				reply({ text: JSON.stringify(payload) });
				break;
		}
	});
});

bot.on('message', (payload, reply) => {
	console.log('message incoming!');
  bot.getProfile(payload.sender.id, (err, profile) => {
		const name = `${profile.first_name} ${profile.last_name}`;
		const responseText = Strings.WELCOME.replace(Strings.KEYS.NAME, name);
		const responseButtons = WelcomeButtons();
		analytics.sendEvent("welcome", payload.sender.id, payload.sender.id, function(err, httpResponse) {
			if (err) {console.log("ERR", err)};
		}); 		
		reply({
			attachment: {
				type: 'template',
				payload: {
					template_type: 'button',
					text: responseText,
					buttons: responseButtons
				}
			}
		}, err => {
			console.log(err);
		});
  })
});

app.use("/fbbot", bot.middleware());
app.use("/_coverage", express.static(path.resolve('./coverage/lcov-report')));

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