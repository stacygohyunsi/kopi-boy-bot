const Strings = {};
Strings.KEYS = {
		NAME: '%_NAME_%'
};
Strings.COMING_SOON = 'Sadly this feature is not available yet. Like our Page and leave us comments if you wish to see this feature up and about!';

Strings.WELCOME = `
Hi, %_NAME_%, KopiBoy is your personal assistant in discovering awesome cafés near you.

How can I help you today?
`;

Strings.CAFE_RANDOM = 'Café Roulette';
Strings.CAFE_RANDOM_ABOUT = 'Up for an adventure aren\'t you? Sure, we\'ll find you cafés: ';
Strings.CAFE_LIST = 'Cafés Near Me';
Strings.CAFE_ADD = 'I found a Café!';
Strings.WITHIN_NEARBY = 'Nearby';
Strings.WITHIN_COUNTRY_RANDOM = 'Within my Country';

Strings.CALL_THIS_CAFE = 'Call Café';
Strings.VIEW_WEBSITE = 'View Website';
Strings.SHOW_ANOTHER = 'Show Me Another'

Strings.SUCCESS = {
	CAFE_FOUND: [
		`Awesome possum, ${Strings.KEYS.NAME}, we've found you a kopi place we think you'll love:`,
		`Great work, ${Strings.KEYS.NAME}, it was a challenge but we found you a kopi place that sounds great for a day like today:`
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
		'Oops, something went wrong with our systems and we\'re not quite sure. We\'re terribly sorry.'
	]
};

module.exports = Strings;