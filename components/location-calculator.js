const haversine = require('haversine');
const cos = Math.cos;
const PI = Math.PI;

 // (mean) radius of Earth
const radii = {
	km:    6371,
	mile:  3960,
	meter: 6371000,
	nmi:   3440
}
let metricPerDegree;
let degreeChange;

const distance = {
	getDistance(o1, o2) {
		return haversine(o1, o2, { unit: 'meter' });
	},
	getLatitudeBounds(obj, d) {
		const metric = 'meter';
		metricPerDegree = (2*PI/360) * radii[metric];
		degreeChange = d/metricPerDegree;
		return {
			lowerLatitude: obj.latitude - degreeChange,
			upperLatitude: obj.latitude + degreeChange
		}
	},
	getLongitudeBounds(obj, d) {
		const metric = 'meter';
		metricPerDegree = (2*PI/360) * radii[metric] * cos(obj.latitude * PI/180);
		degreeChange = d/metricPerDegree;
		return {
			leftLongitude: obj.longitude - degreeChange,
			rightLongitude: obj.longitude + degreeChange
		}
	}
}

module.exports = distance;