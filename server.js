require('newrelic');
// const apiAiConfig = require('./api.ai.config');
// const http = require('http');
// const path = require("path");
// const superagent = require('superagent');
// const moment = require('moment');
const express = require('express');
const Bot = require('messenger-bot');

const Features = require('./components/features');
const Strings = require('./components/strings');
const Actions = require('./components/actions');

const WelcomeButtons = require('./components/buttons/welcome');
const ProximityButtons = require('./components/buttons/proximity');

const CafeRandom = require('./components/actions/cafe-random');
const WithinCountry = require('./components/actions/within-country');

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
		switch(payload.postback.payload) {
			case Actions.CAFE_ADD:
				reply({ text: Strings.COMING_SOON }, err => {
					console.log(err);
				});
				break;
			case Actions.CAFE_LIST:
				reply({ text: Strings.COMING_SOON }, err => {
					console.log(err);
				});
				break;
			case Actions.WITHIN_NEARBY:
				reply({ text: 'nearby' });
				break;
			case Actions.WITHIN_COUNTRY_RANDOM:
				WithinCountry.handleRandom(reply, profile);
				break;
			case Actions.CAFE_RANDOM:
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

/** ADMIN INTERFACE */
// app.use("/bower_components",express.static("bower_components")); // Shared libraries
// app.use("/resources",express.static("resources")); // Shared libraries

/** API */
// app.use("/api", require("./api"));
// app.use("/",express.static("display"));
// app.get(['/','/*', '/**'], function(req, res) {
//   res.sendFile(path.join(__dirname, '/display/index.html'));
// });

app.listen(process.env.PORT);
console.log(`Kopiboy bot server running at port ${process.env.PORT}.`);