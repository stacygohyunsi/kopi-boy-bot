const {expect} = require('chai');
const path = require('path');

const Features = require('../features');
const Strings = require('../strings');

describe('KopiBoy::Components::Buttons::Proximity', () => {
	const expectedComponentLocation = path.resolve('./components/buttons/proximity-random.js');
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
		let originalState;
		beforeEach(() => {
			originalState = Features.WITHIN_COUNTRY_RANDOM()
		});

		afterEach(() => {
			Features.WITHIN_COUNTRY_RANDOM = () => originalState;
		});

		it('is returned when feature is turned on', () => {
			Features.WITHIN_COUNTRY_RANDOM = () => true;
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.WITHIN_COUNTRY_RANDOM)).to.have.length(1);
		});

		it('is not returned when feature is turned off', () => {
			Features.WITHIN_COUNTRY_RANDOM = () => false;
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.WITHIN_COUNTRY_RANDOM)).to.have.length(0);
		});
	} : null);

	describe('within nearby button', componentExists ? () => {
		let originalState;
		beforeEach(() => {
			originalState = Features.WITHIN_PROXIMITY_RANDOM()
		});

		afterEach(() => {
			Features.WITHIN_PROXIMITY_RANDOM = () => originalState;
		});

		it('is returned when feature is turned on', () => {
			Features.WITHIN_PROXIMITY_RANDOM = () => true;
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.WITHIN_PROXIMITY_RANDOM)).to.have.length(1);
		});

		it('is not returned when feature is turned off', () => {
			Features.WITHIN_PROXIMITY_RANDOM = () => false;
			let found = false;
			const observed = component();
			expect(observed.filter(button => button.title === Strings.WITHIN_200M_RANDOM)).to.have.length(0);
		});
	} : null);
})