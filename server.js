// const apiAiConfig = require('./api.ai.config');
// const http = require('http');
// const path = require("path");
// const superagent = require('superagent');
// const moment = require('moment');
const express = require('express');
const Bot = require('messenger-bot');
const ACTIONS = require('./actions');
const FEATURES = require('./features');
const STRINGS = require('./strings');

const WelcomeButtons = require('./components/buttons/welcome');
const LocationProximityButtons = require('./components/buttons/location-proximity');
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
	switch(payload.postback.payload) {
		case ACTIONS.CAFE_ADD:
			reply({ text: STRINGS.COMING_SOON }, err => {
				console.log(err);
			});
			break;
		case ACTIONS.CAFE_LIST:
			reply({ text: STRINGS.COMING_SOON }, err => {
				console.log(err);
			});
			break;
		case ACTIONS.WITHIN_NEARBY:
			reply({ text: 'nearby' });
			break;
		case ACTIONS.WITHIN_COUNTRY:
			reply({ text: 'country' });
			break;
		case ACTIONS.CAFE_RANDOM:
			const responseText = STRINGS.CAFE_ABOUT_RANDOM;
			const responseButtons = LocationProximityButtons();
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
			break;
		default:
			reply({ text: JSON.stringify(payload) });
			break;
	}
});

bot.on('message', (payload, reply) => {
	console.log('message incoming!');
  bot.getProfile(payload.sender.id, (err, profile) => {
		const name = `${profile.first_name} ${profile.last_name}`;
		const responseText = STRINGS.WELCOME.replace(STRINGS.KEYS.NAME, name);
		const responseButtons = new WelcomeButtons();
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