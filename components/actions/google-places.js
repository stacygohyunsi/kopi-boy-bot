const request = require('superagent');
const key = "AIzaSyD03pVE01RDbOrbf-33OI1ohV25wgD2dXI";

const GooglePlaces = {
	getPlace(latitude, longitude, radius, callback) {
	request
		.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json')
		.query({ location: latitude + ',' + longitude, radius: radius, type: 'cafe', key: key })
		.end(function(err, res) {
			if (err) { console.log(err); }
			var results =  res.body.results;
			var one = results[Math.floor(Math.random()*results.length)];
			var obj = {
				name: one.name,
				address: one.vicinity,
				latitude: one.geometry.location.lat,
				longitude: one.geometry.location.lng
			};
			if (one.photos) {
				obj.image_url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${one.photos[0].photo_reference}&key=${key}`;
			}
			request
				.get('https://maps.googleapis.com/maps/api/place/details/json')
				.query({ placeid: one.place_id,key: key })
				.end(function(err, res) {
					if (err) { console.log(err); }
					var details = res.body.result;
					obj.contact_number = details.formatted_phone_number || null;
					obj.website_url = details.website || null;
					if (details.opening_hours) {
						if (details.opening_hours.weekday_text.length === 7) {
							obj.opening_hours = details.opening_hours.weekday_text[(((new Date()).getDay() + 6) % 7)];
						} else {
							obj.opening_hours = details.opening_hours.weekday_text.toString().replace(/,/gi, '\n');
						}
					}
					callback(obj);
				})
		});
	}
}

module.exports = GooglePlaces;