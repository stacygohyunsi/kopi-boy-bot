const chai = require('chai');
chai.use(require('sinon-chai'));
const { expect } = chai;
const path = require('path');
const sinon = require('sinon');

describe('KopiBoy::Components::Analytics', () => {
	const expectedComponentLocation = path.join(process.cwd(), '/components/analytics.js');
	let component = null;
	try {
		component = require(expectedComponentLocation);
	} catch(ex) { }

	it('is located at the right position', () => {
		expect(() => {
			component = require(expectedComponentLocation);
		}).to.not.throw();
	});

	it('implements the correct functions', () => {
		const expectedFunctionList = [
			'generateFormattedData',
			'sendEvent',
			'standardCallback'
		];
		expectedFunctionList.forEach(fnName => {
			expect(Object.keys(component)).to.contain(fnName);
			expect(component[fnName]).to.be.a('function');
		});
	});

	it('has the correct keys', () => {
		const expectedKeysList = [
			'GOOGLE_ANALYTICS_PROPERTY_ID',
			'GOOGLE_ANALYTICS_URL'
		];
		expectedKeysList.forEach(keyName => {
			expect(Object.keys(component)).to.contain(keyName);
		});
	});

	describe('.sendEvent()', () => {
		it('throws an error if no arguments are supplied', () => {
			expect(() => {
				component.sendEvent();
			}).to.throw();
		});
		it('calls the :callback argument after it is done', (done) => {
			component.sendEvent('test', 'run', 'cid', () => {
				done();
			});
		});
	});

	describe('.generateFormattedData()', () => {
		it('throws an error if no arguments are supplied', () => {
			expect(() => {
				component.generateFormattedData();
			}).to.throw();
		});
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

	describe('.standardCallback()', () => {
		it('sends the specified error to the error console', () => {
			sinon.stub(console, 'error');
			component.standardCallback('expectedString');
			expect(console.error).to.be.calledOnce;
			expect(console.error).to.be.calledWith('expectedString');
			console.error.restore();
		});
	})
});