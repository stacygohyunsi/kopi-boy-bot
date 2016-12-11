const express = require('express');
const http = require('http');
const path = require("path");
const moment = require('moment');
const superagent = require('superagent');
const Bot = require('messenger-bot');

const apiAiConfig = require('./api.ai.config');

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
}

const bot = new Bot(config[process.env.NODE_ENV]);

bot.on('error', (err) => {
  console.log(err.message);
});

bot.on('postback', (payload, reply) => {
	console.info('[POSTBACK] ----------------------------------------');
	console.info(`payload:   ${payload}`);
	console.info('[/POSTBACK] ---------------------------------------');
	switch(payload) {
	case 'order_confirm_1':
		reply({
			text: 'That was easy peasy wasn\'t it!'
		});
		break;
	case 'order_confirm_0':
		reply({
			text: 'Awwwww'
		});
	}
});

bot.on('message', (payload, reply) => {
  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) { throw err; }
		console.info('[PROFILE] ----------------------------------------');
		console.info(profile);
		console.info('[/PROFILE] ---------------------------------------');
		const query = payload.message.text;
		console.info('[MSGIN] ----------------------------------------');
		console.info(`Query:   ${payload.message.text}`);
		console.info('[/MSGIN] ---------------------------------------');
		const lang = 'en';
		const sessionId = payload.sender.id;
		const postAddress = `${apiAiConfig.BASE_URL}${apiAiConfig.RESOURCES.QUERY}`;
		const postData = { query, lang, sessionId };
		const postHeaderAuthorization = `Bearer ${process.env.APIAI_CLIENT_TOKEN}`;
		superagent.post(postAddress)
			.set('Authorization', postHeaderAuthorization)
			.set('Content-Type', 'application/json; charset=utf-8')
			.send(postData)
			.query({ v: '20150910' })
			.end((err, apiAiResponse) => {
				if(err) {
					console.error('[ERR] ----------------------------------------');
					console.error(err);
					console.error('[/ERR] ---------------------------------------');
					reply({
						text: err.toString()
					}, (err) => {
						console.error('FATAL ERROR');
					});
					throw err;
				}
				const result = apiAiResponse.body.result;
				if(
					(result.parameters['Drinks'].length != 0)
					&& (result.parameters['number'].length != 0)
					&& (result.parameters['Temperature'].length != 0)
					&& (result.parameters['SugarLevel'].length != 0)
					&& (result.parameters['time'].length != 0)
				) {
					const {
						Drinks, number, SugarLevel, Temperature, time
					} = result.parameters;
					const humanTimeForPickup = moment('14:15:00', 'HH:mm:ss').format('h:m a');
					const ourResponse = {
						attachment: {
							type: "template",
							payload: {
								template_type: "button",
								text: `Confirm order of ${number} ${Temperature} ${Drinks} with ${SugarLevel} sugar for pickup at ${humanTimeForPickup}?`,
								buttons: [
									{
										type: 'postback',
										title: 'yes',
										payload: 'order_confirm_1'
									},
									{
										type: 'postback',
										title: 'no',
										payload: 'order_confirm_0'
									}
								]
							}
						}
					};
					reply(ourResponse, (err) => {
						console.error('[ERR] ----------------------------------------');
						console.error(err);
						console.error('[/ERR] ---------------------------------------');
					});
				} else {
					const ourResponse = {
						text: result.fulfillment.speech
					};
					console.log(`[MSGOUT] ${ourResponse.text}`);
					reply(ourResponse, (err) => {
						if(err) {
							console.error('[ERR] ----------------------------------------');
							console.error(err);
							console.error('[/ERR] ---------------------------------------');
						}
					});
				}
			});
  })
});

app.use("/fbbot", bot.middleware());

/** ADMIN INTERFACE */
app.use("/bower_components",express.static("bower_components")); // Shared libraries

/** API */
var admin = require("./api/admin.js");
app.use("/api", admin.router);

app.use("/",express.static("display"));
app.get(['/','/*', '/**'], function(req, res) {
  res.sendFile(path.join(__dirname, '/display/index.html'));
});

app.listen(process.env.PORT);
console.log(`Kopiboy bot server running at port ${process.env.PORT}.`);