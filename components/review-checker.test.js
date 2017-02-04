const {expect} = require('chai');
const path = require('path');

describe('KopiBoy::Components::ReviewChecker [#139038581, #139038537, #139038487]', () => {
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

	it('implements .sendReviewURLs()', componentExists ? () => {
		expect(component.sendReviewURLs).to.not.be.undefined;
	} : null);

	it('implements .generateHungryGoWhereURL()', componentExists ? () => {
		expect(component.generateHungryGoWhereURL).to.not.be.undefined;
	} : null);	

	it('implements .generateBurppleURL()', componentExists ? () => {
		expect(component.generateBurppleURL).to.not.be.undefined;
	} : null);	

	it('implements .generateYelpURL()', componentExists ? () => {
		expect(component.generateYelpURL).to.not.be.undefined;
	} : null);		

	describe('.generateHungryGoWhereURL()', () => {
		it('throws an error if no arguments are supplied', componentExists ? () => {
			expect(() => {
				component.generateHungryGoWhereURL();
			}).to.throw();
		} : null);

		it('returns a Hungry Go Where URL string as expected', () => {
			const name = "the botanist";
			const expected = component.HUNGRYGOWHERE_URL + encodeURIComponent(name);
			expect(component.generateHungryGoWhereURL(name)).to.deep.equal(expected);
		});			
	});

	describe('.generateBurppleURL()', () => {
		it('throws an error if no arguments are supplied', componentExists ? () => {
			expect(() => {
				component.generateBurppleURL();
			}).to.throw();
		} : null);

		it('returns a Burpple URL string as expected', () => {
			const name = "the botanist";
			const expected = component.BURPPLE_URL + encodeURIComponent(name);
			expect(component.generateBurppleURL(name)).to.deep.equal(expected);
		});		
	});		

	describe('.generateYelpURL()', () => {
		it('throws an error if no arguments are supplied', componentExists ? () => {
			expect(() => {
				component.generateYelpURL();
			}).to.throw();
		} : null);

		it('returns a Yelp URL string as expected', () => {
			const name = "the botanist";
			const expected = component.YELP_URL + encodeURIComponent(name);
			expect(component.generateYelpURL(name)).to.deep.equal(expected);
		});
	});	

	describe('.sendReviewURLs()', () => {
		it('throws an error if no arguments are supplied', componentExists ? () => {
			expect(() => {
				component.sendReviewURLs();
			}).to.throw();
		} : null);

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