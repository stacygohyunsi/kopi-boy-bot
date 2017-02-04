
const throwNoArgumentsError = (() => {
	throw new EvalError('No arguments indicating search query was found.');
});

const ReviewChecker = {
	BURPPLE_URL: 'http://burpple.com/search/sg?utf8=✓&commit=&q=',
	HUNGRYGOWHERE_URL: 'http://www.hungrygowhere.com/search-results/',
	YELP_URL: 'https://www.yelp.com/search?find_desc='
};

ReviewChecker.generateHungryGoWhereURL = function(queryString) {
	(arguments.length === 0) && throwNoArgumentsError();
	return ReviewChecker.HUNGRYGOWHERE_URL.concat(encodeURIComponent(queryString));
};

ReviewChecker.generateBurppleURL = function(queryString) {
	(arguments.length === 0) && throwNoArgumentsError();
	return ReviewChecker.BURPPLE_URL.concat(encodeURIComponent(queryString));
};

ReviewChecker.generateYelpURL = function(queryString) {
	(arguments.length === 0) && throwNoArgumentsError();
	return ReviewChecker.YELP_URL.concat(encodeURIComponent(queryString));
};

ReviewChecker.sendReviewURLs = function(queryString) {
	(arguments.length === 0) && throwNoArgumentsError();
	return {
		hungryGoWhere: ReviewChecker.generateHungryGoWhereURL(queryString),
		burpple: ReviewChecker.generateBurppleURL(queryString),
		yelp: ReviewChecker.generateYelpURL(queryString)
	};
};

module.exports = ReviewChecker;