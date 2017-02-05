const {expect} = require('chai');
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

	it('contains a HungryGoWhere query URL', componentExists ? () => {
		expect(component.HUNGRYGOWHERE_URL).to.not.be.undefined;
	} : null);

	it('contains a Burpple query URL', componentExists ? () => {
		expect(component.BURPPLE_URL).to.not.be.undefined;
	} : null);

	it('contains a Yelp query URL', componentExists ? () => {
		expect(component.YELP_URL).to.not.be.undefined;
	} : null);

	it('implements .sendReviewURLs()', componentExists ? () => {
		expect(component.sendReviewURLs).to.not.be.undefined;
	} : null);

	it('implements .generateHungryGoWhereURL() [#139038487]', componentExists ? () => {
		expect(component.generateHungryGoWhereURL).to.not.be.undefined;
	} : null);

	describe('.generateHungryGoWhereURL()', componentExists ? () => {
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
	} : null);

	it('implements .generateBurppleURL() [#139038581]', componentExists ? () => {
		expect(component.generateBurppleURL).to.not.be.undefined;
	} : null);

	describe('.generateBurppleURL()', componentExists ? () => {
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
	} : null);

	it('implements .generateYelpURL() [#139038537]', componentExists ? () => {
		expect(component.generateYelpURL).to.not.be.undefined;
	} : null);

	describe('.generateYelpURL()', componentExists ? () => {
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
	} : null);

	describe('.sendReviewURLs()', componentExists ? () => {
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
	} : null);


});