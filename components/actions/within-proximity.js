const Sequelize = require('sequelize');

const Analytics = require('../analytics');
const Cache = require('../cache');
const Actions = require('./index');
const Models = require('../../models');
const Strings = require('../strings');
const distance = require('../location-calculator');
const MapOpener = require('../map-opener');
const ReviewChecker = require('../review-checker');
const Utterance = require('../utterance');
const ProximityRandomButtons = require('../buttons/proximity-random');

const {
	generateGenericTemplateType,
	generateListTemplateType,
	generatePostbackButton,
	generateTemplateAttachment,
	generateWebUrlButton
} = require('./utility');


const WithinProximityAction = {
	createBasicInfoElement: (place) => {
		(!place.name) && (() => { throw new EvalError('Expected property `name` is not defined.')})();
		(!place.address) && (() => { throw new EvalError('Expected property `address` is not defined.' )})();
		// when data integrity is perfect, re-enable
		// (!place.image_url) && (() => { throw new EvalError('Expected property `image_url` is not defined.' )})();
		// (!place.website_url) && (() => { throw new EvalError('Expected property `website_url` is not defined.' )})();
		// (!place.contact_number) && (() => { throw new EvalError('Expected property `contact_number` is not defined.' )})();

		const buttons = [];
		(place.website_url) && (buttons.push(generateWebUrlButton(
			place.website_url,
			Strings.VIEW_WEBSITE
		)));
		(place.latitude && place.longitude) && (buttons.push(generateWebUrlButton(
			MapOpener.getUrl(place.latitude, place.longitude).locationFallback,
			Strings.GET_DIRECTIONS
		)));
		buttons.push(generatePostbackButton(
			Actions.WITHIN_PROXIMITY_RANDOM_REPEAT,
			Strings.SHOW_ANOTHER
		));

		return {
			title: place.name,
			image_url: place.image_url ? place.image_url : null,
			subtitle: place.address,
			default_action: {
				type: 'web_url',
				url: place.website_url
			},
			buttons
		};
	},

	createOpeningHoursElement: (place) => {
		(!place) && (() => { throw new EvalError('Required parameter `place` could not be found.') })();

		const buttons = [];
		(place.contact_number) && (buttons.push({
			type: 'phone_number',
			payload: place.contact_number,
			title: Strings.CALL_THIS_CAFE
		}));
		(place.contact_email) && (buttons.push({
			type: 'web_url',
			payload: `mailto:${place.contact_email}`,
			title: Strings.EMAIL_THIS_CAFE
		}));

		const element = {
			title: Strings.LABEL_OPENING_HOURS,
			subtitle: place.opening_hours || Strings.LABEL_OPENING_HOURS_UNAVAILABLE
		};
		if(buttons.length > 0) {
			element.buttons = buttons;
		}
		return element;
	},

	createReply: function(name) {
		const payload = generateListTemplateType(
			[
				WithinProximityAction.generateMessageElement(name),
				WithinProximityAction.generate200mElement(),
				WithinProximityAction.generate500mElement(),
				WithinProximityAction.generate2kmElement()
			], [
				generatePostbackButton(Actions.WITHIN_NEVERMIND, Strings.WITHIN_NEVERMIND)
			]
		);

		return generateTemplateAttachment(payload);
	},

	createReviewsElement: (place) => {
		(!place) && (() => { throw new EvalError('Required paramtere `place` was not found.')})();
		(!place.name) && (() => { throw new EvalError('Required property `name` of `place` parameter was not found.') })();

		const reviewSiteUrls = WithinProximityAction.createReviewWebsitesButtons(place.name);
		const buttons = [{
			type: 'web_url',
			url: reviewSiteUrls.burpple,
			title: Strings.CHECKOUT_BURPPLE_REVIEWS
		},
		{
			type: 'web_url',
			url: reviewSiteUrls.hungryGoWhere,
			title: Strings.CHECKOUT_HUNGRYGOWHERE_REVIEWS
		},
		{
			type: 'web_url',
			url: reviewSiteUrls.yelp,
			title: Strings.CHECKOUT_YELP_REVIEWS
		}];

		return {
			title: Strings.LABEL_REVIEWS,
			subtitle: Strings.LABEL_REVIEWS_MORE,
			buttons
		};
	},

	createReviewWebsitesButtons: (cafeName) => {
		(typeof cafeName !== 'string') && (() => { throw new EvalError('Café name must be of type String'); })();

		return {
			burpple: ReviewChecker.generateBurppleURL(cafeName),
			hungryGoWhere: ReviewChecker.generateHungryGoWhereURL(cafeName),
			yelp: ReviewChecker.generateYelpURL(cafeName)
		}
	},

	generateMessageElement: function(name) {
		return {
			title: Strings.DIALOG.random(name),
			image_url: Strings.URL_IMAGE.PROXIMITY
		};
	},

	generate200mElement: function() {
		return {
			title: Strings.LABEL_WITHIN_200M,
			subtitle: Strings.LABEL_WITHIN_200M_DESC,
			buttons: [
				generatePostbackButton(Actions.WITHIN_200M_RANDOM, Strings.WITHIN_200M_RANDOM)
			]
		};
	},

	generate500mElement: function() {
		return {
			title: Strings.LABEL_WITHIN_500M,
			subtitle: Strings.LABEL_WITHIN_500M_DESC,
			buttons: [
				generatePostbackButton(Actions.WITHIN_500M_RANDOM, Strings.WITHIN_500M_RANDOM)
			]
		};
	},

	generate2kmElement: function() {
		return {
			title: Strings.LABEL_WITHIN_2KM,
			subtitle: Strings.LABEL_WITHIN_2KM_DESC,
			buttons: [
				generatePostbackButton(Actions.WITHIN_2KM_RANDOM, Strings.WITHIN_2KM_RANDOM)
			]
		};
	},

	generateReply: (place) => {
		const elements = [WithinProximityAction.createBasicInfoElement(place)];
		(place.opening_hours) && elements.push(WithinProximityAction.createOpeningHoursElement(place));
		elements.push(WithinProximityAction.createReviewsElement(place));

		const payload = generateGenericTemplateType(elements);
		return generateTemplateAttachment(payload);
	},

	handleLocationRequest: function(reply, profile, callback) {
		(!reply) && (() => { throw new EvalError('Required parameter `reply` was not found.'); })();
		(!profile) && (() => { throw new EvalError('Required parameter `profile` was not found.'); })();

		const name = profile.first_name;
		reply({ text: Strings.LOCATION_REQUEST.replace(Strings.KEYS.NAME, name) }, (callback) ? callback : (err => {
			(err) && Analytics.sendEvent(Strings.SYSTEM.error('Actions::WithinProximity::handleLocationRequest'),0,0);
		}));
	},

	handle200mRandom: function(reply, profile, callback) {
		Cache.setLastDistanceSelection(profile.sender.id, 200, (err, resp) => {
			WithinProximityAction.handleLocationRequest(reply, profile, callback);	
		});
	},

	handle500mRandom: function(reply, profile, callback) {
		Cache.setLastDistanceSelection(profile.sender.id, 500, (err, resp) => {
			WithinProximityAction.handleLocationRequest(reply, profile, callback);	
		});
	},

	handle2kmRandom: function(reply, profile, callback) {
		Cache.setLastDistanceSelection(profile.sender.id, 2048, (err, resp) => {
			WithinProximityAction.handleLocationRequest(reply, profile, callback);
		});
	},

	handleNevermind: function(reply, profile, callback) {
		(!reply) && (() => { throw new EvalError('Required parameter `reply` was not found.'); })();
		(!profile) && (() => { throw new EvalError('Required parameter `profile` was not found.'); })();
		const responseText = 'Sure, let\'s find you cafés:';
		const responseButtons = ProximityRandomButtons();

		reply({
			attachment: {
				type: 'template',
				payload: {
					template_type: 'button',
					text: responseText,
					buttons: responseButtons
				}
			}
		}, (err, info) => {
			(callback) ? callback(err, info) : (() => { })();
		});
	},

	handleRandom: function(reply, profile, callback) {
		(!reply) && (() => { throw new EvalError('Required parameter `reply` was not found.'); })();
		(!profile) && (() => { throw new EvalError('Required parameter `profile` was not found.'); })();

		const name = profile ? profile.first_name : 'dear user';

		reply(WithinProximityAction.createReply(name), (err, info) => {
			(callback) ? callback(err, info) : (() => { })();
		});
	}, 
	handleRandomRepeat: function(reply, profile, callback) {
		(!reply) && (() => { throw new EvalError('Required parameter `reply` was not found.'); })();
		(!profile) && (() => { throw new EvalError('Required parameter `profile` was not found.'); })();		
		Cache.getLastKnownLocation(profile.sender.id, (err, info) => {
			if (err) {console.log('ERR', err);}
			Utterance.calculateDistance(reply, profile, info.latitude, info.longitude);
		});
	}
};

module.exports = WithinProximityAction;