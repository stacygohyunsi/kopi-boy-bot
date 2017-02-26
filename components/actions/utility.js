const Strings = require('../strings');
const Analytics = require('../analytics');

const UtilityActions = {
	generateGenericTemplateType: function(elements) {
		return {
			template_type: 'generic',
			elements
		};
	},
	generateListTemplateType: function(elements, buttons) {
		return {
			template_type: 'list',
			elements, buttons
		};
	},
	generatePostbackButton: function(payload, title) {
		return {
			type: 'postback',
			payload, title
		}
	},
	generateTemplateAttachment: function(payload) {
		return {
			attachment:{
				type: 'template',
				payload
			}
		};
	},
	generateWebUrlButton: function(url, title) {
		return {
			type: 'web_url',
			url, title
		};
	},
	sendCafe: function(reply, cafe, replyGenerator, callback) {
		console.log(cafe);
		reply(replyGenerator(cafe), (err, info) => {
			(callback) ? callback(err, info) : ((err, info) => {
				console.log(info);
				console.error(err);
				(err) && UtilityActions.sendErrorMessage(reply, err);
			});
		});
	},
	sendErrorMessage: function(reply, err) {
		console.error(err);
		reply({
			text: Strings.FAILURE.error()
		});
		Analytics.sendEvent("Err", err.toString(), 0);
	}
};

module.exports = UtilityActions;
