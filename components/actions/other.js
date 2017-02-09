const OtherActions = {
	handleUnknown: function(reply, profile) {
		reply({
			text: 'I\'m sorry, I couldn\'t understand that.'
		});
	}
};

module.exports = OtherActions;