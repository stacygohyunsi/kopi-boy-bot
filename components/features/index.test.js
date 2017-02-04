const {expect} = require('chai');
const path = require('path');

describe('KopiBoy::Components::Features', () => {
	const expectedComponentLocation = path.join(process.cwd(), '/components/features/index.js');
	let componentExists = false;
	const component = (() => {
		try {
			const _component = require(expectedComponentLocation);
			componentExists = true;
			return _component;
		} catch(ex) { }
	})();

	it('exists', () => {
		expect(() => {
			require(expectedComponentLocation);
		}).to.not.throw();
	});

	it('implements .CAFE_RANDOM()', () => {
		expect(component.CAFE_RANDOM).to.not.be.undefined;
	});
	
	it('implements .CAFE_LIST()', () => {
		expect(component.CAFE_LIST).to.not.be.undefined;
	});
	
	it('implements .CAFE_ADD()', () => {
		expect(component.CAFE_ADD).to.not.be.undefined;
	});
	
	it('implements .WITHIN_NEARBY_LIST()', () => {
		expect(component.WITHIN_NEARBY_LIST).to.not.be.undefined;
	});
	
	it('implements .WITHIN_1KM_LIST()', () => {
		expect(component.WITHIN_1KM_LIST).to.not.be.undefined;
	});
	
	it('implements .WITHIN_5KM_LIST()', () => {
		expect(component.WITHIN_5KM_LIST).to.not.be.undefined;
	});
	
	it('implements .WITHIN_NEARBY_RANDOM()', () => {
		expect(component.WITHIN_NEARBY_RANDOM).to.not.be.undefined;
	});
	
	it('implements .WITHIN_1KM_RANDOM()', () => {
		expect(component.WITHIN_1KM_RANDOM).to.not.be.undefined;
	});
	
	it('implements .WITHIN_5KM_RANDOM()', () => {
		expect(component.WITHIN_1KM_RANDOM).to.not.be.undefined;
	});
	
	it('implements .WITHIN_COUNTRY_RANDOM()', () => {
		expect(component.WITHIN_COUNTRY_RANDOM).to.not.be.undefined;
	});
});