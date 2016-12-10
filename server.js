const express = require('express');
const http = require('http');
const path = require("path");
const superagent = require('superagent');
const Bot = require('messenger-bot');

const apiAiCOnfig = require('./api.ai.config');

const app = express();

/** CONFIG */
process.env.PORT = process.env.PORT || 8080;
const config = {
  development: {
    token: "EAAQhCRnyD7UBAJ3c2gItTTtTZCJj9IgnJm3RY9TUGr1Yfc5gxJY5kmP3BghkIID2Yq5rtAspi3WZArj3Af3MNdxrZBU7vvQbBZBOORZBpGDBZA1hIZB8ect0UZBpzAJxv9r8IcZATDhSmvFNQdagCaUOu9miHvHWzZAG6pJSpuZBW5pcAZDZD",
    verify: "greatestbotonearth",
    app_secret: "f8078e16030ed64e5b5f44cc8778aa72"
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

bot.on('message', (payload, reply) => {
  const query = payload.message.text;
	const lang = 'en';
	const sessionId = payload.sender.id;

	console.log('[MSGIN] ${query}');

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) { throw err; }
		const postAddress = `${apiAiCOnfig.BASE_URL}${apiAiCOnfig.RESOURCES.QUERY}`;
		const postData = { query, lang, sessionId };
		const postHeaderAuthorization = `Bearer ${config[process.env.APIAI_CLIENT_TOKEN]}`;
		console.log(`[API.AI] POST ${postAddress}`);
		console.log(`[API.AI] Authorization ${postHeaderAuthorization}`);
		console.log(postData);
		superagent.post(postAddress)
			.set('Authorization', postHeaderAuthorization)
			.set('Content-Type', 'application/json; charset=utf-8')
			.send(postData)
			.query({ v: '20150910' })
			.end((err, response) => {
				if(err) {
					reply(err.toString(), (err) => {
						console.error('FATAL ERROR');
					});
					throw err;
				}

				reply(response.body.result.fulfillment.speech, (err) => {
					console.log('[MSGOUT] ${response.body.result.fulfillment.speech}');
				});
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