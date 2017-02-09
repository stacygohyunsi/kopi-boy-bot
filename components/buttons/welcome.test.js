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

	describe('random café button', () => {
		let originalState;
		beforeEach(() => {
			originalState = Features.CAFE_RANDOM()
		});

		afterEach(() => {
			Features.CAFE_RANDOM = () => originalState;
		});

		it('is returned when feature is turned on', () => {
			Features.CAFE_RANDOM = () => true;
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.CAFE_RANDOM)).to.have.length(1);
		});

		it('is not returned when feature is turned off', () => {
			Features.CAFE_RANDOM = () => false;
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.CAFE_RANDOM)).to.have.length(0);
		});
	});

	describe('list of cafés button', () => {
		let originalState;
		beforeEach(() => {
			originalState = Features.CAFE_LIST()
		});

		afterEach(() => {
			Features.CAFE_LIST = () => originalState;
		});

		it('is returned when feature is turned on', () => {
			Features.CAFE_LIST = () => true;
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.CAFE_LIST)).to.have.length(1);
		});

		it('is not returned when feature is turned off', () => {
			Features.CAFE_LIST = () => false;
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.CAFE_LIST)).to.have.length(0);
		});
	});

	describe('add a café button', () => {
		let originalState;
		beforeEach(() => {
			originalState = Features.CAFE_ADD()
		});

		afterEach(() => {
			Features.CAFE_ADD = () => originalState;
		});

		it('is returned when feature is turned on', () => {
			Features.CAFE_ADD = () => true;
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.CAFE_ADD)).to.have.length(1);
		});

		it('is not returned when feature is turned off', () => {
			Features.CAFE_ADD = () => false;
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.CAFE_ADD)).to.have.length(0);
		});
	});
})