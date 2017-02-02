const path = require('path');
const {expect} = require('chai');

describe('KopiBoy::Components::MapOpener', () => {
	const expectedComponentLocation = path.join(process.cwd(), '/components/map-opener');
	
	let currentModule = {};

	it('is located in the right position', () => {
		expect(() => {
			currentModule = require(expectedComponentLocation);
		}).to.not.throw();
	});
	it('implements getUrl()', () => {
		expect(currentModule.getUrl).to.not.be.undefined;
		expect(typeof currentModule.getUrl).to.be.equal('function');
	});

	describe('.getUrl()', () => {
		it('takes in two arguments (latitude : Float, longitude : Float) and returns an Object<{locationFallback : String, location : String}>', () => {
			currentModule.getUrl();
		});
	})
});