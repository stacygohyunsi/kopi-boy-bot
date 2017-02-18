const { expect } = require('chai');
const path = require('path');

describe('KopiBoy::Components::Actions', () => {
	const expectedComponentLocation = path.join(__dirname, './index.js');
	let component = {};

	it('exists', () => {
		expect(() => {
			component = require(expectedComponentLocation);
		}).to.not.throw();
	});

	it('contains action to display all cafés [#138935361, #138564095]', () => {
		expect(component.CAFE_LIST).to.not.be.undefined;
	});

	it('contains action to randomly display a café [#138595655, #138564089]', () => {
		expect(component.CAFE_RANDOM).to.not.be.undefined;
	});

	it('contains action to add a café [#138935433]', () => {
		expect(component.CAFE_ADD).to.not.be.undefined;
	});

	it('contains action associated with welcome message', () => {
		expect(component.WELCOME).to.not.be.undefined;
	});

	it('contains action to display only nearby cafés [#138564095]', () => {
		expect(component.WITHIN_200M_LIST).to.not.be.undefined;
	});

	it('contains action to display only nearby cafés [#138564089]', () => {
		expect(component.WITHIN_200M_RANDOM).to.not.be.undefined;
	});

	it('contains action to display nearby cafés', () => {
		expect(component.WITHIN_500M_RANDOM).to.not.be.undefined;
	});

	it('contains action to display slighty further away cafés', () => {
		expect(component.WITHIN_2KM_RANDOM).to.not.be.undefined;
	});

	it('contains action to display all cafés within the country [#138935691]', () => {
		expect(component.WITHIN_COUNTRY_RANDOM).to.not.be.undefined;
	});

	it('contains action to display all cafés within the country again', () => {
		expect(component.WITHIN_COUNTRY_RANDOM_REPEAT).to.not.be.undefined;
	});

	it('contains action to display all cafés within the country again', () => {
		expect(component.WITHIN_PROXIMITY_RANDOM_REPEAT).to.not.be.undefined;
	});	

});