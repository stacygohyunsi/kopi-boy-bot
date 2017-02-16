const { expect } = require('chai');
const path = require('path');

describe('KopiBoy::Components::ReviewChecker', () => {
	const expectedComponentLocation = path.join(process.cwd(), '/components/review-checker.js');
	let componentExists = false;
	let component = null;
	try {
		component = require(expectedComponentLocation);
		componentExists = true;
	} catch(ex) { }

	it('is located at the right position', () => {
		expect(() => {
			component = require(expectedComponentLocation);
		}).to.not.throw();
	});

	it('contains a HungryGoWhere query URL', () => {
		expect(component.HUNGRYGOWHERE_URL).to.not.be.undefined;
	});

	it('contains a Burpple query URL', () => {
		expect(component.BURPPLE_URL).to.not.be.undefined;
	});

	it('contains a Yelp query URL', () => {
		expect(component.YELP_URL).to.not.be.undefined;
	});

	it('implements .sendReviewURLs()', () => {
		expect(component.sendReviewURLs).to.not.be.undefined;
	});

	it('implements .generateHungryGoWhereURL() [#139038487]', () => {
		expect(component.generateHungryGoWhereURL).to.not.be.undefined;
	});

	describe('.generateHungryGoWhereURL()', () => {
		it('throws an error if no arguments are supplied', () => {
			expect(() => {
				component.generateHungryGoWhereURL();
			}).to.throw();
		});

		it('returns a Hungry Go Where URL string as expected', () => {
			const name = "the botanist";
			const expected = component.HUNGRYGOWHERE_URL + encodeURIComponent(name);
			expect(component.generateHungryGoWhereURL(name)).to.deep.equal(expected);
		});
	});

	it('implements .generateBurppleURL() [#139038581]', () => {
		expect(component.generateBurppleURL).to.not.be.undefined;
	});

	describe('.generateBurppleURL()', () => {
		it('throws an error if no arguments are supplied', () => {
			expect(() => {
				component.generateBurppleURL();
			}).to.throw();
		});

		it('returns a Burpple URL string as expected', () => {
			const name = "the botanist";
			const expected = component.BURPPLE_URL + encodeURIComponent(name);
			expect(component.generateBurppleURL(name)).to.deep.equal(expected);
		});
	});

	it('implements .generateYelpURL() [#139038537]', () => {
		expect(component.generateYelpURL).to.not.be.undefined;
	});

	describe('.generateYelpURL()', () => {
		it('throws an error if no arguments are supplied', () => {
			expect(() => {
				component.generateYelpURL();
			}).to.throw();
		});

		it('returns a Yelp URL string as expected', () => {
			const name = "the botanist";
			const expected = component.YELP_URL + encodeURIComponent(name);
			expect(component.generateYelpURL(name)).to.deep.equal(expected);
		});
	});

	describe('.sendReviewURLs()', () => {
		it('throws an error if no arguments are supplied', () => {
			expect(() => {
				component.sendReviewURLs();
			}).to.throw();
		});

		it('returns an object as expected', () => {
			const name = "the botanist";
			const hungryGoWhere = component.generateHungryGoWhereURL(name);
			const burpple = component.generateBurppleURL(name);
			const yelp = component.generateYelpURL(name);

			const expected = {
				hungryGoWhere: hungryGoWhere,
				burpple: burpple,
				yelp: yelp
			};
			expect(
				component.sendReviewURLs(name)
			).to.deep.equal(expected);
		});
	});


});