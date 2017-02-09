const chai = require('chai');
chai.use(require('sinon-chai'));
const sinon = require('sinon');
const expect = chai.expect;
const path = require('path');

describe('KopiBoy::Components::Notify', () => {
	const expectedComponentLocation = path.join(process.cwd(), '/components/notify.js');
	let componentExists = false;
	let component = null;
	try {
		component = require(expectedComponentLocation);
		componentExists = true;
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
		it('must be called with a valid platform name', () => {
			expect(() => { component('fail'); }).to.throw(TypeError);
			expect(() => { component('telegram'); }).to.not.throw();
		});
	});

});