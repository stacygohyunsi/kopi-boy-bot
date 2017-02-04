const {expect} = require('chai');
const path = require('path');

describe('KopiBoy::Components::Analytics [#138814139]', () => {
	const expectedComponentLocation = path.join(process.cwd(), '/components/analytics.js');
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

	it('implements sendEvent()', componentExists ? () => {
		expect(component.sendEvent).to.not.be.undefined;
	} : null);

	it('implements generateFormattedData()', componentExists ? () => {
		expect(component.generateFormattedData).to.not.be.undefined;
	} : null);	

	describe('.sendEvent()', () => {
		it('throws an error if no arguments are supplied', componentExists ? () => {
			expect(() => {
				console.log(component);
				component.sendEvent();
			}).to.throw();
		} : null);
		it('calls the :callback argument after it is done', (done) => {
			component.sendEvent('action', 'label', 'cid', () => {
				done();
			});
		});
	});

	describe('.generateFormattedData()', () => {
		it('throws an error if no arguments are supplied', componentExists ? () => {
			expect(() => {
				component.generateFormattedData();
			}).to.throw();
		} : null);
		it('returns an object as expected', () => {
			const action = "action";
			const label = "label"; 
			const cid = "cid"; 
			console.log(component.GOOGLE_ANALYTICS_URL);
			const expected = {
				url: component.GOOGLE_ANALYTICS_URL, 
				form: {
					v: '1', 
					tid: component.GOOGLE_ANALYTICS_PROPERTY_ID, 
					cid,
					t: 'event', 
					ec: (process.env.NODE_ENV === 'production') ? 'live' : 'dev',
					ea: action,
					el: label 
				}
			};
			expect(
				component.generateFormattedData(action, label, cid)
			).to.deep.equal(expected);
		});
	});
});