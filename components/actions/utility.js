const UtilityActions = {
	generateGenericTemplateType: function(elements) {
		return {
			template_type: 'generic',
			elements
		};
	},
	generateListTemplateType: function(elements, buttons) {
		return {
			template_type: 'list',
			elements, buttons
		};
	},
	generatePostbackButton: function(payload, title) {
		return {
			type: 'postback',
			payload, title
		}
	},
	generateTemplateAttachment: function(payload) {
		return {
			attachment:{
				type: 'template',
				payload
			}
		};
	},
	generateWebUrlButton: function(url, title) {
		return {
			type: 'web_url',
			url, title
		};
	}
};

module.exports = UtilityActions;
