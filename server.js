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
};

const firebaseDbRef = require('./components/firebase');

const bot = new Bot(config[process.env.NODE_ENV]);

bot.on('error', (err) => {
  console.log(err.message);
});

bot.on('postback', (payload, reply) => {
	console.info('[POSTBACK] ----------------------------------------');
	console.info('[PAYLOAD] ----------------------------------------');
	console.info(payload);
	console.info('[/PAYLOAD] ----------------------------------------');
	console.info('[/POSTBACK] ---------------------------------------');
	const pbPayload = JSON.parse(payload.postback.payload); 
	switch(pbPayload.type) {
	case 'order_confirm_1':
		const order = pbPayload;
		console.log('[ORDER] ----------------------------------------');
		console.log(order);
		console.log('[/ORDER] ----------------------------------------');
		const now = moment().format('YYYYMMDD HH:mm:ss');
		const {customerId} = order;
		var orderHash = require('crypto').createHash('md5').update(`${now}-${customerId}`).digest("hex");
		firebaseDbRef(`/customers/${customerId}`).set({
			name: `${order.customer.first_name} ${order.customer.last_name}`,
			picture: order.customer.profile_pic,
			gender: order.customer.gender,
			locale: order.customer.locale
		});
		const orderedItems = {};
		orderedItems[order.data.Drinks] = order.data.number;
		firebaseDbRef(`/orders/${orderHash}`).set({
			collected: false,
			confirmed: false,
			customer: customerId,
			items: orderedItems,
			sugar: order.data.SugarLevel,
			pickup_at: order.data.time,
			temperature: order.data.Temperature,
			rejected: false
		});
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
		const customerId = payload.sender.id;
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
					const humanTimeForPickup = moment(time, 'HH:mm:ss').format('h:mm a');
					const ourResponse = {
						attachment: {
							type: "template",
							payload: {
								template_type: "button",
								text: `So ${profile.first_name} ${profile.last_name}, confirm order of ${number} ${Temperature} ${Drinks} with ${SugarLevel} sugar for pickup at ${humanTimeForPickup}?`,
								buttons: [
									{
										type: 'postback',
										title: 'DOUBLE CONFIRM',
										payload: JSON.stringify(
											{
												type: 'order_confirm_1',
												customer: profile,
												customerId,
												data: result.parameters 
											}
										)
									},
									{
										type: 'postback',
										title: 'Maybe nehmind...',
										payload: JSON.stringify(
											{
												type: 'order_confirm_0',
												customer: profile,
												customerId,
												data: result.parameters 
											}
										)
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
app.use("/api", require("./api"));
app.use("/",express.static("display"));
app.get(['/','/*', '/**'], function(req, res) {
  res.sendFile(path.join(__dirname, '/display/index.html'));
});

app.listen(process.env.PORT);
console.log(`Kopiboy bot server running at port ${process.env.PORT}.`);