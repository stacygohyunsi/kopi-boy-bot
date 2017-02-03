const request = require("request");

const analytics = {
	sendEvent(action, label, cid, callback) {
		request.post({url:'http://www.google-analytics.com/collect', 
		form: {
			v:'1', 
			tid: 'UA-74732860-10', 
			cid: cid, 
			t: 'event', 
			ec: 'dev', 
			ea: action, 
			el: label
		}}, function(err, httpResponse, body){
			(callback) && callback(err, httpResponse);
		});
	}
}

module.exports = analytics;