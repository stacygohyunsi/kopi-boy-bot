const {expect} = require('chai');
const path = require('path');

const Features = require('../features');
const Strings = require('../strings');

describe('KopiBoy::Components::Buttons::Welcome', () => {
	const expectedComponentLocation = path.resolve('./components/buttons/welcome.js');
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

	describe('random café button', componentExists ? () => {
		it('is returned when feature is turned on', () => {
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.CAFE_RANDOM)).to.have.length(1);
		});

		it('is not returned when feature is turned off', () => {
			Features.CAFE_RANDOM = () => false;
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.CAFE_RANDOM)).to.have.length(0);
			Features.CAFE_RANDOM = () => true;
		});
	} : null);

	describe('list of cafés button', componentExists ? () => {
		it('is returned when feature is turned on', () => {
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.CAFE_LIST)).to.have.length(1);
		});

		it('is not returned when feature is turned off', () => {
			Features.CAFE_LIST = () => false;
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.CAFE_LIST)).to.have.length(0);
			Features.CAFE_LIST = () => true;
		});
	} : null);

	describe('add a café button', componentExists ? () => {
		it('is returned when feature is turned on', () => {
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.CAFE_ADD)).to.have.length(1);
		});

		it('is not returned when feature is turned off', () => {
			Features.CAFE_ADD = () => false;
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.CAFE_ADD)).to.have.length(0);
			Features.CAFE_ADD = () => true;
		});
	} : null);
})