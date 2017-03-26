const Strings = {};
Strings.KEYS = {
		NAME: '%_NAME_%'
};
Strings.COMING_SOON = 'Sadly this feature is not available yet. Like our Page and leave us comments if you wish to see this feature up and about!';

Strings.WELCOME = `
Hi, ${Strings.KEYS.NAME}, KopiBoy is your personal assistant in discovering awesome cafés near you.

How can I help you today?
`;

Strings.CAFE_RANDOM = 'Café Roulette';
Strings.CAFE_RANDOM_ABOUT = `
🖐🏽 Hi, ${Strings.KEYS.NAME}, I'm KopiBoy and I exist to discover amazing cafés in Singapore for you
to hang out at or catch up with friends!

Let's find you a cafe:
`;
Strings.CAFE_LIST = 'Cafés Near Me';
Strings.CAFE_ADD = 'I found a Café!';
Strings.CHECKOUT_BURPPLE_REVIEWS = 'Burpple';
Strings.CHECKOUT_HUNGRYGOWHERE_REVIEWS = 'HungryGoWhere';
Strings.CHECKOUT_YELP_REVIEWS = 'Yelp';
Strings.LOCATION_REQUEST = `Awesome, ${Strings.KEYS.NAME}, can use the location button below to send me where you are?\n\n(like don't type ah use the button kay)`;
Strings.LABEL_OPENING_HOURS = 'Opening Hours';
Strings.LABEL_OPENING_HOURS_UNAVAILABLE = 'Unavailable. Call/email them for more information!';
Strings.LABEL_REVIEWS = 'Get a second opinion';
Strings.LABEL_REVIEWS_MORE = 'Not sure about this place? Let\'s help you get a second opinion on...';
Strings.LABEL_WITHIN_200M = 'Really Nearby';
Strings.LABEL_WITHIN_200M_DESC = 'Within a 5 minute walk from where you are.';
Strings.LABEL_WITHIN_500M = 'Slightly Further';
Strings.LABEL_WITHIN_500M_DESC = 'Within a 15 minute walk from where you are.';
Strings.LABEL_WITHIN_2KM = 'Even Further';
Strings.LABEL_WITHIN_2KM_DESC = 'Within a 30 minutes walk or 5 minute drive from where you are.';
Strings.WITHIN_200M_RANDOM = 'Within 200 metres';
Strings.WITHIN_500M_RANDOM = 'Within 500 metres'
Strings.WITHIN_2KM_RANDOM = 'Within 2 kilometres'
Strings.WITHIN_PROXIMITY_RANDOM = 'Nearby Me Lah';
Strings.WITHIN_COUNTRY_RANDOM = 'Anywhere Also Can';
Strings.WITHIN_NEVERMIND = 'Nevermind';

Strings.EMAIL_THIS_CAFE = 'Send Email';
Strings.CALL_THIS_CAFE = 'Give A Call';
Strings.GET_DIRECTIONS = 'Get Directions';
Strings.VIEW_WEBSITE = 'View Website';
Strings.SHOW_ANOTHER = 'Show Me Another'

Strings.DIALOG = {
	RANDOM: `So, ${Strings.KEYS.NAME}, an Adventure!`,
	random: (name) => Strings.DIALOG.RANDOM.replace(new RegExp(Strings.KEYS.NAME, 'gi'), (name || 'dear user'))
}

Strings.URL_IMAGE = {
	PROXIMITY: 'https://scontent-sit4-1.xx.fbcdn.net/v/t1.0-9/16508075_742760355874278_8508412211420611200_n.png?oh=af5c4b5876ce0e2145eaaf06a33db37d&oe=590FF3FE'
};

Strings.SYSTEM = {
	ERROR: `SYSTEM_ERROR_AT_${Strings.KEYS.NAME}`,
	error: (errorKey) => Strings.SYSTEM.ERROR.replace(new RegExp(Strings.KEYS.NAME, 'gi'), errorKey)
};

Strings.SUCCESS = {
	CAFE_FOUND: [
		`Swee la, ${Strings.KEYS.NAME}, check out this one...`,
		`Steady pom pi pi, ${Strings.KEYS.NAME}, how about this one...`,
		`Nah, ${Strings.KEYS.NAME}, don't say bojio...`,
		`Don't share with other people ah, ${Strings.KEYS.NAME}, see this one...`
	],
	cafeFound: (nameOfUser) => Strings.SUCCESS.CAFE_FOUND[
		Math.floor(Math.random() * Strings.SUCCESS.CAFE_FOUND.length - 0.001)
	].replace(new RegExp(Strings.KEYS.NAME, 'gi'), nameOfUser),

	CAFES_FOUND: [
		'After some soul searching, we\'ve cobbled together a list of cafés for you:'
	],
	cafesFound: (nameOfUser) => Strings.SUCCESS.CAFES_FOUND[
		Math.floor(Math.random() * Strings.SUCCESS.CAFES_FOUND.length - 0.001)
	].replace(new RegExp(Strings.KEYS.NAME, 'gi'), nameOfUser)
};

Strings.FAILURE = {
	ERROR: [
		'Oops, something went wrong with our systems and we\'re not quite sure. We\'re terribly sorry.', 
		'Oops, something went wrong with my internals, and my creators have been notified so I\'ll be fixed soon. Apologies for the inconvenience.'
	], 
	error: function() {
		const index = Math.floor(Math.random() * Strings.FAILURE.ERROR.length);
		return Strings.FAILURE.ERROR[index];
	}
};

module.exports = Strings;