const {expect} = require('chai');
const path = require('path');

describe('KopiBoy::Models', () => {
	const expectedComponentLocation = path.resolve('./models');
	let models;
	it('has Models [#138604129]', () => {
		expect(() => {
			models = require(expectedComponentLocation);
		}).to.not.throw();
	});
});