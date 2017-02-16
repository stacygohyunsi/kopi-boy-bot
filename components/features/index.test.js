const { expect } = require('chai');
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

	it('implements .WITHIN_PROXIMITY_LIST()', () => {
		expect(component.WITHIN_PROXIMITY_LIST).to.not.be.undefined;
	});

	it('implements .WITHIN_200M_LIST()', () => {
		expect(component.WITHIN_200M_LIST).to.not.be.undefined;
	});

	it('implements .WITHIN_2KM_LIST()', () => {
		expect(component.WITHIN_2KM_LIST).to.not.be.undefined;
	});

	it('implements .WITHIN_500M_LIST()', () => {
		expect(component.WITHIN_500M_LIST).to.not.be.undefined;
	});

	it('implements .WITHIN_PROXIMITY_RANDOM()', () => {
		expect(component.WITHIN_PROXIMITY_RANDOM).to.not.be.undefined;
	});

	it('implements .WITHIN_200M_RANDOM()', () => {
		expect(component.WITHIN_200M_RANDOM).to.not.be.undefined;
	});

	it('implements .WITHIN_500M_RANDOM()', () => {
		expect(component.WITHIN_500M_RANDOM).to.not.be.undefined;
	});

	it('implements .WITHIN_2KM_RANDOM()', () => {
		expect(component.WITHIN_500M_RANDOM).to.not.be.undefined;
	});

	it('implements .WITHIN_COUNTRY_RANDOM()', () => {
		expect(component.WITHIN_COUNTRY_RANDOM).to.not.be.undefined;
	});
});