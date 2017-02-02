const {expect} = require('chai');
const path = require('path');

describe('KopiBoy::Components::LocationCalculator', () => {
	const expectedComponentLocation = path.join(process.cwd(), '/components/location-calculator.js');
	const latitude = Math.random() * 90;
	const longitude = Math.random() * 90;
	const location1 = { latitude, longitude };
	const location2 = { latitude, longitude };
	const distance = 100;
	let currentModule = {};

	it('is located in the right position', () => {
		expect(() => {
			currentModule = require(expectedComponentLocation);
		}).to.not.throw();
	});
	it('implements getDistance()', () => {
		expect(currentModule.getDistance).to.not.be.undefined;
	});
	it('implements getLatitudeBounds()', () => {
		expect(currentModule.getLatitudeBounds).to.not.be.undefined;
	});
	it('implements getLongitudeBounds()', () => {
		expect(currentModule.getLongitudeBounds).to.not.be.undefined;
	});
	describe('.getDistance()', () => {
		it('takes in two arguments of Object<{latitude:Float,longitude:Flat}> and returns an integer', () => {
			const observedDistance = currentModule.getDistance(location1, location2);
			expect(typeof observedDistance).to.be.equal('number');
		});
		it('calculates distance between two points accurately', () => {
			const expectedDistance = 0;
			const observedDistance = currentModule.getDistance(location1, location2);
			expect(observedDistance).to.be.equal(expectedDistance);
		})
	});
	describe('.getLatitudeBounds()', () => {
		it('takes in a single argument of Object<{latitude:Float,longitude:Float}> and distance and returns an Object<{upperLatitude:Float,lowerLatitude:Float}>', () => {
			const observedReturnedValue = currentModule.getLatitudeBounds(location1, distance);
			expect(observedReturnedValue.upperLatitude).to.not.be.undefined;
			expect(typeof observedReturnedValue.upperLatitude).to.be.equal('number');
			expect(observedReturnedValue.lowerLatitude).to.not.be.undefined;
			expect(typeof observedReturnedValue.lowerLatitude).to.be.equal('number');
		});
	});
	describe('.getLongitudeBounds()', () => {
		it('takes in a single argument of Object<{latitude:Float,longitude:Float}> and distance and returns an Object<{leftLongitude:Float,rightLongitude:Float}>', () => {
			const observedReturnedValue = currentModule.getLongitudeBounds(location1, distance);
			expect(observedReturnedValue.leftLongitude).to.not.be.undefined;
			expect(typeof observedReturnedValue.leftLongitude).to.be.equal('number');
			expect(observedReturnedValue.rightLongitude).to.not.be.undefined;
			expect(typeof observedReturnedValue.rightLongitude).to.be.equal('number');
		});
	});
});