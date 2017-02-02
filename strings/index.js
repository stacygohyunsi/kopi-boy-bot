const STRINGS = {};
STRINGS.KEYS = {
		NAME: '%_NAME_%'
};
STRINGS.COMING_SOON = 'Sadly this feature is not available yet. Like our Page and leave us comments if you wish to see this feature up and about!',
STRINGS.WELCOME = `
Hi, %_NAME_%, KopiBoy is your personal assistant in discovering awesome cafés near you.

How can I help you today?
`,
STRINGS.CAFE_RANDOM = 'Café Roulette',
STRINGS.CAFE_RANDOM_ABOUT = 'Up for an adventure aren\'t you? Sure, we\'ll find you cafés: ',
STRINGS.CAFE_LIST = 'Cafés Near Me',
STRINGS.CAFE_ADD = 'I found a Café!',
STRINGS.WITHIN_NEARBY = 'Nearby',
STRINGS.WITHIN_COUNTRY = 'Within my Country',

STRINGS.SUCCESS = {
	CAFE_FOUND: [
		`Awesome possum, ${STRINGS.KEYS.NAME}, we've found you a kopi place we think you'll love:`,
		`Great work, ${STRINGS.KEYS.NAME}, it was a challenge but we found you a kopi place that sounds great for a day like today:`
	],
	cafeFound: (nameOfUser) => STRINGS.SUCCESS.CAFE_FOUND[
		Math.floor(Math.random() * STRINGS.SUCCESS.CAFE_FOUND.length - 0.001)
	].replace(new RegExp(STRINGS.KEYS.NAME, 'gi'), nameOfUser),
	CAFES_FOUND: [
		'After some soul searching, we\'ve cobbled together a list of cafés for you:'
	],
	cafesFound: (nameOfUser) => STRINGS.SUCCESS.CAFES_FOUND[
		Math.floor(Math.random() * STRINGS.SUCCESS.CAFES_FOUND.length - 0.001)
	].replace(new RegExp(STRINGS.KEYS.NAME, 'gi'), nameOfUser)
};

STRINGS.FAILURE = {
	ERROR: [
		'Oops, something went wrong with our systems and we\'re not quite sure. We\'re terribly sorry.'
	]
};

module.exports = STRINGS;