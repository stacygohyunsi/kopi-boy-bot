const request = require("request");

const Analytics = {};
Analytics.GOOGLE_ANALYTICS_URL = 'http://www.google-analytics.com/collect';
Analytics.GOOGLE_ANALYTICS_PROPERTY_ID = 'UA-74732860-10';

Analytics.generateFormattedData = function(action, label, cid) {
	(arguments.length === 0) && (() => { throw new Error('At least `action` needs to be defined'); })();
	return {
		url: Analytics.GOOGLE_ANALYTICS_URL, 
		form: {
			v:'1', 
			tid: Analytics.GOOGLE_ANALYTICS_PROPERTY_ID, 
			cid: cid,
			t: 'event', 
			ec: 'dev', 
			ea: action, 
			el: label
		}
	}
};

Analytics.sendEvent = function(action, label, cid, callback) {
	(arguments.length === 0) && (() => { throw new Error('At least `action` needs to be defined'); })();
	request.post(
		Analytics.generateFormattedData(action, label, cid),
		function(err, httpResponse, body){
		(callback) && callback(err, httpResponse);
		}
	);
};

module.exports = Analytics;