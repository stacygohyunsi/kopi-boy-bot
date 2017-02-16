const path = require('path');
const { expect } = require('chai');

describe('KopiBoy::Components::Utterance', () => {
	const expectedComponentLocation = path.join(__dirname, './utterance.js');
	let component;
	try {
		component = require(expectedComponentLocation);
	} catch(ex) {}

	it('exists at the right location', () => {
		expect(() => {
			require(expectedComponentLocation);
		}).to.not.throw();
	});

	it('implements .handleDefault()', () => {
		expect(component.handleDefault).to.not.be.undefined;
		expect(component.handleDefault).to.be.a.function;
	});

	it('implements .handleLocation()', () => {
		expect(component.handleLocation).to.not.be.undefined;
		expect(component.handleLocation).to.be.a.function;
	});

	it('implements .handleText()', () => {
		expect(component.handleText).to.not.be.undefined;
		expect(component.handleText).to.be.a.function;
	});

	xdescribe('.handleDefault()', () => {

	});

	xdescribe('.handleLocation()', () => {

	});

	xdescribe('.handleText()', () => {

	});
})