const Utterance = require('../utterance');
const Cache = require('../cache');
const Actions = require('../actions');

const CafeRandomRepeatActions = {
	handleRandomRepeat: function(reply, profile, callback) {
		(!reply) && (() => { throw new Error('Expected parameter `reply` could not be found.'); })();
		(!profile) && (() => { throw new Error('Expected parameter `profile` could not be found.'); })();

		Cache.getLastAction(profile.sender.id, (err, info) => {
			if (err) { console.log("ERR", err); }
			if (info == Actions.WITHIN_PROXIMITY_RANDOM) {
				Cache.getLastKnownLocation(profile.sender.id, (err, locations) => {
					if (err) {console.log('ERR', err);}
					Utterance.handleCafeWithDistance(reply, profile, locations.latitude*1, locations.longitude*1);
				});
			} else {
				Utterance.handleCafe(reply, callback);
			}
		});
	}
}
module.exports = CafeRandomRepeatActions;