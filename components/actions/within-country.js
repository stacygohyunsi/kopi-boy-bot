const Sequelize = require('sequelize');

const Models = require('../../models');
const Actions = require('../actions');
const Strings = require('../strings');

const MapOpener = require('../map-opener');
const ReviewChecker = require('../review-checker');

const {
	generateGenericTemplateType,
	generatePostbackButton,
	generateTemplateAttachment,
	generateWebUrlButton
} = require('./utility');

const ActionWithinCountry = {
	createBasicInfoElement: (place) => {
		(!place.name) && (() => { throw new EvalError('Expected property `name` is not defined.')})();
		(!place.address) && (() => { throw new EvalError('Expected property `address` is not defined.' )})();
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
			Actions.WITHIN_COUNTRY_RANDOM_REPEAT,
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
			title: 'Opening Hours',
			subtitle: place.opening_hours || 'Unavailable. Call/email them for more information!'
		};
		if(buttons.length > 0) {
			element.buttons = buttons;
		}
		return element;
	},

	createReviewsElement: (place) => {
		const reviewSiteUrls = ActionWithinCountry.createReviewWebsitesButtons(place.name);
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
			title: 'Get a second opinion',
			subtitle: 'Not sure about this place? Let\'s help you get a second opinion on...',
			buttons
		};
	},

	createReviewWebsitesButtons: (cafeName) => {
		(arguments.length === 0) && (() => { throw new EvalError('Café name must be specified'); })();
		(typeof cafeName !== 'string') && (() => { throw new EvalError('Café name must be of type String'); })();
		return {
			burpple: ReviewChecker.generateBurppleURL(cafeName),
			hungryGoWhere: ReviewChecker.generateHungryGoWhereURL(cafeName),
			yelp: ReviewChecker.generateYelpURL(cafeName)
		}
	},

	generateReply: (place) => {
		const elements = [ActionWithinCountry.createBasicInfoElement(place)];
		(place.opening_hours) && elements.push(ActionWithinCountry.createOpeningHoursElement(place));
		elements.push(ActionWithinCountry.createReviewsElement(place));

		const payload = generateGenericTemplateType(elements);
		return generateTemplateAttachment(payload);
	},
	
	handleRandom: (reply, profile, callback) => {
		(typeof reply !== 'function') && (() => { throw new EvalError('Parameter `reply` is not a valid function.') })();
		(!profile) && (() => { throw new EvalError('Expected argument `profile` was not found.') })();

		const name = profile ? profile.first_name : 'dear user';
		Models.places.find({ order: [ Sequelize.fn('RAND') ] }).then((res) => {
			const {dataValues} = res;
			const leadText = Strings.SUCCESS.cafeFound(name);
			reply({ text: leadText });
			setTimeout(() => {
				reply(ActionWithinCountry.generateReply(dataValues), (err, info) => {
					(callback) ? callback(err, info) : (() => { })();
				});
			}, 1500);
		});
	},
	
	handleRandomRepeat: (reply, profile, callback) => {
		(typeof reply !== 'function') && (() => { throw new EvalError('Parameter `reply` is not a valid function.') })();
		(!profile) && (() => { throw new EvalError('Expected argument `profile` was not found.') })();

		const name = profile ? profile.first_name : 'dear user';
		Models.places.find({ order: [ Sequelize.fn('RAND') ] }).then((res) => {
			reply(ActionWithinCountry.generateReply(res.dataValues), (err, info) => {
				(callback) ? callback(err, info) : (() => { })();
			});
		});
	}
};

module.exports = ActionWithinCountry;