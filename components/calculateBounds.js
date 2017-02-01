const haversine = require('haversine');
var cos = Math.cos
var sin = Math.sin
var sqrt = Math.sqrt
var PI = Math.PI

 // (mean) radius of Earth
var radii = {
	km:    6371,
	mile:  3960,
	meter: 6371000,
	nmi:   3440
}

const distance = {
	getDistance(o1, o2) {
		return haversine(o1, o2, {unit: 'meter'});
	},
	getLatitudeBounds(lat, d, metric) {
		if (!metric) {
			metric = 'meter';
		}
		metricPerDeg = (2*PI/360) * radii[metric];
		degChange = d/metricPerDeg;
		return {
			lowerLat: lat - degChange,
			upperLat: lat + degChange
		}
	}, 
	getLongitudeBounds(lat, long, d, metric) {
		if (!metric) {
			metric = 'meter';
		}
		metricPerDeg = (2*PI/360) * radii[metric] * cos(lat * PI/180);
		degChange = d/metricPerDeg;
		return {
			lowerLong: long - degChange,
			upperLong: long + degChange
		}
	}	
}

module.exports = distance;