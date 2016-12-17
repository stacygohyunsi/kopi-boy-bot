const express = require("express");
const Bot = require('messenger-bot');
const firebase = require('../components/firebase');
const moment = require('moment');
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

const replyBot = new Bot(config[process.env.NODE_ENV]);
const ApiRouter = express.Router();

function processOrder(order) {

}

ApiRouter.use('/confirm/:orderId', (req, res, next) => {
	const {orderId} = req.params;
	firebase(`/orders/${orderId}`).once('value').then((responseOrder) => {
		const order = responseOrder.val();
		const {items} = order;
		const item = [];
		for(var menuItem in items) {
			item.push(menuItem);
		}
		firebase(`/customers/${order.customer}`).once('value').then((responseCustomer) => {
			const customer = responseCustomer.val();
			const sugarLevel = (order.sugar.toLowerCase() === 'none' ? 'no' : `${order.sugar.toLowerCase()}`) + ' sugar'; 
			const quantity = order.items[item[0]];
			const temperature = order.temperature.toLowerCase();
			const itemName = item[0];
			const rawPickupTime = order.pickup_at.split(':');
			const refinedPickupTime = new Date();
			refinedPickupTime.setHours(rawPickupTime[0]);
			refinedPickupTime.setMinutes(rawPickupTime[1]);
			const pickupTime = moment(refinedPickupTime).format('h:mm a');

			replyBot.sendMessage(order.customer, {
				text: `Hello there, ${customer.name}, your order of ${quantity} ${temperature} ${itemName} with ${sugarLevel} has been confirmed for pickup at ${pickupTime}. Seeya in abit!(:`
			}, (error, info) => {
				res.json((!error) ? { customer, info } : { customer, error });
			});
		});
	});
});

ApiRouter.use('/reject/:orderId', (req, res, next) => {
	const {orderId} = req.params;
	firebase(`/orders/${orderId}`).once('value').then((responseOrder) => {
		const order = responseOrder.val();
		const {items} = order;
		const item = [];
		for(var menuItem in items) {
			item.push(menuItem);
		}
		firebase(`/customers/${order.customer}`).once('value').then((responseCustomer) => {
			const customer = responseCustomer.val();
			const sugarLevel = (order.sugar.toLowerCase() === 'none' ? 'no' : `${order.sugar.toLowerCase()}`) + ' sugar'; 
			const quantity = order.items[item[0]];
			const temperature = order.temperature.toLowerCase();
			const itemName = item[0];
			const rawPickupTime = order.pickup_at.split(':');
			const refinedPickupTime = new Date();
			refinedPickupTime.setHours(rawPickupTime[0]);
			refinedPickupTime.setMinutes(rawPickupTime[1]);
			const pickupTime = moment(refinedPickupTime).format('h:mm a');

			replyBot.sendMessage(order.customer, {
				text: `Bad news, ${customer.name}, your order of ${quantity} ${temperature} ${itemName} with ${sugarLevel} has been rejected by the store. Try again later perhaps ):`
			}, (error, info) => {
				res.json((!error) ? { customer, info } : { customer, error });
			});
		});
	});
});

module.exports = ApiRouter;