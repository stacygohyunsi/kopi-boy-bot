const chai = require('chai');
chai.use(require('sinon-chai'));
const sinon = require('sinon');
const expect = chai.expect;
const path = require('path');
const rewire = require('rewire');
const moduleRewired = rewire('./notify.js');

describe('KopiBoy::Components::Notify', () => {
	const expectedComponentLocation = path.join(process.cwd(), '/components/notify.js');
	let component = null;
	try {
		component = require(expectedComponentLocation);
	} catch(ex) { }

	it('exists at the right location', () => {
		expect(() => {
			require(expectedComponentLocation);
		}).to.not.throw();
	});

	it('can be instantiated by calling itself', () => {
		expect(component).to.not.be.undefined;
	});

	it('implements .telegram()', () => {
		expect(component.telegram).to.not.be.undefined;
		expect(component.telegram).to.be.a.function;
	});

	describe('instantiation', () => {
		it('cannot be called with an invalid platform name', () => {
			expect(() => { component('fail'); }).to.throw(EvalError);
		});

		it('results in calling of static platform method', () => {
			component.platform = function() {};
			const platformStub = sinon.stub(component, 'platform');
			component('platform');
			expect(platformStub).to.be.calledOnce;
			platformStub.restore();
		});
	});

	describe('.telegram()', () => {
		it('cannot be called without an option', () => {
			expect(() => { component.telegram(null, null); }).to.throw(EvalError);
		});
		it('cannot be called without a token in the option', () => {
			expect(() => { component.telegram(null, {}); }).to.throw();
		});
	});
});