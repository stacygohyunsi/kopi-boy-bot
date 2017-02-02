const Sequelize = require('sequelize');

const Models = require('../../models');

const STRINGS = require('../../strings');

const ActionWithinCountry = {
	handle: (reply, profile) => {
		const name = profile ? profile.name : 'dear user';
		Models.places.find({ order: [ Sequelize.fn('RAND') ] }).then((res) => {
			const {dataValues} = res;
			const leadText = STRINGS.SUCCESS.cafeFound(name);
			reply({ text: leadText });
			setTimeout(() => {
				reply({
					"attachment":{
						"type":"template",
						"payload":{
							"template_type":"generic",
							"elements":[
								{
									"title": dataValues.name,
									"image_url": null,
									"subtitle": dataValues.address,
									"default_action": {
										"type": "web_url",
										"url": dataValues.website_url
									},
									"buttons":[
										{
											"type":"web_url",
											"url": dataValues.website_url,
											"title":"View Website"
										},
										{
											"type":"phone_number",
											"payload": dataValues.contact_number,
											"title":"Call Em'"
										}
									]      
								},
								{
									title: 'Need Directions?',
									subtitle: 'Check it out in your favourite maps application',
									buttons: [
										{
											type: 'web_url',
											url: 'https://joeir.net',
											title: 'Open in Google Maps'
										},
										{
											type: 'web_url',
											url: 'https://joeir.net',
											title: 'Open in Apple Maps'
										},
										{
											type: 'web_url',
											url: 'https://joeir.net',
											title: 'Open in Maps'
										}
									]
								},
								{
									title: 'Opening Hours',
									subtitle: dataValues.opening_hours || 'Unavailable'
								}
							]
						}
					}
				}, (err, info) => {
					console.log(err);
					console.log(info);
				});
			}, 1000);
		});
	}
};

module.exports = ActionWithinCountry;