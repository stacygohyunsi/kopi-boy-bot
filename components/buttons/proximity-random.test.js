const {expect} = require('chai');
const path = require('path');

const Features = require('../features');
const Strings = require('../strings');

describe('KopiBoy::Components::Buttons::Proximity', () => {
	const expectedComponentLocation = path.join(__dirname, './proximity-random.js');
	let component = null;
	try {
		component = require(expectedComponentLocation);
	} catch(ex) { }
	
	it('exists', () => {
		expect(() => {
			require(expectedComponentLocation);
		}).to.not.throw();
	});

	describe('within country button', () => {
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
	});

	describe('within nearby button', () => {
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
	});
})