const {expect} = require('chai');

describe('KopiBoy::Models', () => {
	let models;
	it('has Models [#138604129]', () => {
		(() => {
			models = require('../../models');
		}).should.not.throw();
	});
	it('contains a Model named `places`', () => {
		expect(models.places).to.not.be.undefined;
	});
});