const {expect} = require('chai');
const path = require('path');

describe('KopiBoy::Components::Analytics [#138814139]', () => {
	const expectedComponentLocation = path.join(process.cwd(), '/components/analytics');
	let componentExists = false;
	let component = null;
	try {
		component = require(expectedComponentLocation);
		componentExists = true;
	} catch(ex) { }

	it('is located at the right position', () => {
		expect(() => {
			component = require(expectedComponentLocation);
		}).to.not.throw();
	});

	it('implements sendEvent()', componentExists ? () => {
		expect(component.sendEvent).to.not.be.undefined;
	} : null);

	describe('.sendEvent()', () => {
		it('throws an error if no arguments are supplied', componentExists ? () => {
			expect(() => {
				component.sendEvent();
			}).to.throw();
		} : null);
		it('can take in one to four String arguments', componentExists ? () => {
			expect(() => { component.sendEvent('a'); }).to.not.throw();
			expect(() => { component.sendEvent('a', 'b'); }).to.not.throw();
			expect(() => { component.sendEvent('a', 'b', 'c'); }).to.not.throw();
			expect(() => { component.sendEvent('a', 'b', 'c', 'd'); }).to.not.throw();
		} : null);
		it('always uses the last argument as a callback', component ? (done) => {
			let asyncCallbackCount = 4;
			component.sendEvent('a', function() { ((--asyncCallbackCount) === 0) && done(); });
			component.sendEvent('a', 'b', function() { ((--asyncCallbackCount) === 0) && done(); });
			component.sendEvent('a', 'b', 'c', function() { ((--asyncCallbackCount) === 0) && done(); });
			component.sendEvent('a', 'b', 'c', 'd', function() { ((--asyncCallbackCount) === 0) && done(); });
		} : null);
	});
});