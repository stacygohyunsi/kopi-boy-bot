const {expect} = require('chai');
const path = require('path');

const Features = require('../features');
const Strings = require('../strings');

describe('KopiBoy::Components::Buttons::Proximity', () => {
	const expectedComponentLocation = path.resolve('./components/buttons/proximity.js');
	let componentExists = false;
	const component = (() => {
		try {
			const _component = require(expectedComponentLocation);
			componentExists = true;
			return _component;
		} catch(ex) { return null; }
	})();
	
	it('exists', () => {
		expect(() => {
			require(expectedComponentLocation);
		}).to.not.throw();
	});

	describe('within country button', componentExists ? () => {
		it('is returned when feature is turned on', () => {
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.WITHIN_COUNTRY)).to.have.length(1);
		});

		it('is not returned when feature is turned off', () => {
			Features.WITHIN_COUNTRY = () => false;
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.WITHIN_COUNTRY)).to.have.length(0);
			Features.WITHIN_COUNTRY = () => true;
		});
	} : null);

	describe('within nearby button', componentExists ? () => {
		it('is returned when feature is turned on', () => {
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.WITHIN_NEARBY)).to.have.length(1);
		});

		it('is not returned when feature is turned off', () => {
			Features.WITHIN_NEARBY = () => false;
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.WITHIN_NEARBY)).to.have.length(0);
			Features.WITHIN_NEARBY = () => true;
		});
	} : null);
})