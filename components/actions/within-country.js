const Sequelize = require('sequelize');

const Models = require('../../models');
const Actions = require('../actions');
const Strings = require('../strings');

const MapOpener = require('../map-opener');

const ActionWithinCountry = {
	createBasicInfoElement: (place) => {
		(!place.name) && (() => { throw new EvalError('Expected property `name` is not defined.')})();
		(!place.address) && (() => { throw new EvalError('Expected property `address` is not defined.' )})();
		// (!place.image_url) && (() => { throw new EvalError('Expected property `image_url` is not defined.' )})();
		// (!place.website_url) && (() => { throw new EvalError('Expected property `website_url` is not defined.' )})();
		// (!place.contact_number) && (() => { throw new EvalError('Expected property `contact_number` is not defined.' )})();

		const buttons = [];
		(place.website_url) && (buttons.push({
			type: 'web_url',
			url: place.website_url,
			title: Strings.VIEW_WEBSITE
		}));
		(place.contact_number) && (buttons.push({
			type: 'phone_number',
			payload: place.contact_number,
			title: Strings.CALL_THIS_CAFE
		}));
		buttons.push({
			type:'postback',
			payload: Actions.WITHIN_COUNTRY_RANDOM,
			title: Strings.SHOW_ANOTHER
		});

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

	createLocationElement: (place) => {
		(!place.latitude) && (() => { throw new EvalError('Latitude is not defined.')})();
		(!place.longitude) && (() => { throw new EvalError('Longitude is not defined.' )})();
		const url = MapOpener.getUrl(place.latitude, place.longitude);
		return {
			title: 'Need Directions?',
			subtitle: 'Check it out in your favourite maps application',
			buttons: [
				{
					type: 'web_url',
					url: url.locationFallback,
					title: 'Open in Google Maps'
				}
			]
		};
	},

	createOpeningHoursElement: (place) => ({
		title: 'Opening Hours',
		subtitle: place.opening_hours || 'Unavailable'
	}),

	createGenericPayload: (elements) => {
		return {
			template_type: 'generic',
			elements
		};
	},

	generateReply: (place) => {
		const elements = [ActionWithinCountry.createBasicInfoElement(place)];
		(place.longitude && place.latitude) && elements.push(ActionWithinCountry.createLocationElement(place));
		(place.opening_hours) && elements.push(ActionWithinCountry.createOpeningHoursElement(place));

		const payload = ActionWithinCountry.createGenericPayload(elements);
		return {
			attachment:{
				type: 'template',
				payload
			}
		};
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
					(callback) ? callback(err, info) : (() => {
						console.log(err);
						console.log(info);
					})();
				});
			}, 1000);
		});
	}
};

module.exports = ActionWithinCountry;