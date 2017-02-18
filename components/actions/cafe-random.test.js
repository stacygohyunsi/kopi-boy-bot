const { expect } = require('chai');
const path = require('path');
const sinon = require('sinon');

const Analytics = require('../analytics');

describe('KopiBoy::Components::Actions::CafeRandom', () => {
	const expectedComponentLocation = path.join(__dirname, './cafe-random.js');
	try {
		component = require(expectedComponentLocation);
	} catch(ex) { }

	let callbackSpy;
	let replySpy;
	let analyticsSendEventMock;
	let reply;
	let profile;
	let component = null;

	before(() => {
		analyticsSendEventMock = sinon.stub(Analytics, 'sendEvent');
		callbackSpy = sinon.spy();
		profile = {
			id: 'id',
			first_name: 'first_name',
			middle_name: 'middle_name',
			last_name: 'last_name'
		};
		replySpy = sinon.spy();
		reply = (payload, callback) => {
			replySpy();
			(callback) && callback();
		};
	});

	afterEach(() => {
		analyticsSendEventMock.reset();
	});

	after(() => {
		analyticsSendEventMock.restore();
	});

	it('exists', () => {
		expect(() => {
			component = require(expectedComponentLocation);
		}).to.not.throw();
	});

	it('implements the correct functions', () => {
		expect(Object.keys(component)).to.deep.equal([
			'handle'
		]);
	});

	describe('.handle()', () => {
		it('throws an error if `reply` is not provided', () => {
			expect(() => {
				component.handle(null, profile);
			}).to.throw();
		});
		it('throws an error if `profile` is not provided', () => {
			expect(() => {
				component.handle(reply, null);
			}).to.throw();;
		});
		it('calls `reply` if successful', () => {
			const previousCallCount = replySpy.callCount;
			component.handle(reply, profile, callbackSpy);
			expect(replySpy.callCount).to.equal(previousCallCount + 1);
		});
		it('calls callback if callback is available', () => {
			const previousCallCount = callbackSpy.callCount;
			component.handle(reply, profile, callbackSpy);
			expect(callbackSpy.callCount).to.equal(previousCallCount + 1);
		});
		it('sends analytics', () => {
			component.handle(reply, profile, callbackSpy);
			expect(analyticsSendEventMock.callCount).to.equal(1);
		});
	})
});