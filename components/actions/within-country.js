const Sequelize = require('sequelize');

const Models = require('../../models');
const Strings = require('../strings');

const MapOpener = require('../map-opener');

const ActionWithinCountry = {
	createBasicInfoElement: (place) => {
		(!place.name) && (() => { throw new Error('Expected property `name` is not defined.')})();
		(!place.address) && (() => { throw new Error('Expected property `address` is not defined.' )})();
		// (!place.image_url) && (() => { throw new Error('Expected property `image_url` is not defined.' )})();
		(!place.website_url) && (() => { throw new Error('Expected property `website_url` is not defined.' )})();
		// (!place.contact_number) && (() => { throw new Error('Expected property `contact_number` is not defined.' )})();

		const buttons = [{
			type:"web_url",
			url: place.website_url,
			title:"View Website"
		}];
		(place.contact_number) && (buttons.push({
			type: "phone_number",
			payload: place.contact_number,
			title: "Call Em'"
		}))

		return {
			title: place.name,
			image_url: place.image_url ? place.image_url : null,
			subtitle: place.address,
			default_action: {
				type: "web_url",
				url: place.website_url
			},
			buttons
		};
	},

	createLocationElement: (place) => {
		(!place.latitude) && (() => { throw new Error('Latitude is not defined.')})();
		(!place.longitude) && (() => { throw new Error('Longitude is not defined.' )})();
		
		return {
			title: 'Need Directions?',
			subtitle: 'Check it out in your favourite maps application',
			buttons: [
				{
					type: 'web_url',
					url: MapOpener.getUrl(place.latitude, place.longitude),
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
				type: "template",
				payload
			}
		};
	},
	
	handle: (reply, profile) => {
		const name = profile ? profile.name : 'dear user';
		Models.places.find({ order: [ Sequelize.fn('RAND') ] }).then((res) => {
			const {dataValues} = res;
			const leadText = Strings.SUCCESS.cafeFound(name);
			reply({ text: leadText });
			setTimeout(() => {
				reply(ActionWithinCountry.generateReply(dataValues), (err, info) => {
					console.log(err);
					console.log(info);
				});
			}, 1000);
		});
	}
};

module.exports = ActionWithinCountry;