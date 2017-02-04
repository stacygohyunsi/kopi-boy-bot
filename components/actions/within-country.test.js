const {expect} = require('chai');
const path = require('path');
const sinon = require('sinon');

describe('KopiBoy::Components::Actions::WithinCountry', () => {
	const expectedComponentLocation = path.join(__dirname, './within-country.js');
	let componentExists = false;
	let component = null;
	try {
		component = require(expectedComponentLocation);
		componentExists = true;
	} catch(ex) { }
	const name = 'name';
	const image_url = 'image_url';
	const address = 'address';
	const website_url = 'website_url';
	const contact_number = 'contact_number';
	const latitude = 'latitude';
	const longitude = 'longitude';
	const opening_hours = 'opening_hours';

	it('exists', () => {
		expect(() => {
			component = require(expectedComponentLocation);
		}).to.not.throw();
	});

	describe('component methods', () => {
		it('implements .createBasicInfoElement()', componentExists ? () => {
			expect(component.createBasicInfoElement).to.not.be.undefined;
		} : null);
		
		it('implements .createLocationElement()', componentExists ? () => {
			expect(component.createLocationElement).to.not.be.undefined;
		} : null);
		
		it('implements .createOpeningHoursElement()', componentExists ? () => {
			expect(component.createOpeningHoursElement).to.not.be.undefined;
		} : null);
		
		it('implements .createGenericPayload()', componentExists ? () => {
			expect(component.createGenericPayload).to.not.be.undefined;
		} : null);
		
		it('implements .generateReply()', componentExists ? () => {
			expect(component.generateReply).to.not.be.undefined;
		} : null);
		
		it('implements .handle()', componentExists ? () => {
			expect(component.handle).to.not.be.undefined;
		} : null);
	})

	describe('.createBasicInfoElement()', componentExists && component.createBasicInfoElement ? () => {
		it('takes in a data row from `place` table and returns a Facebook messenger element', () => {
			const observed = component.createBasicInfoElement({
				name, image_url, address, website_url, contact_number
			});
			expect(observed.title).to.equal(name);
			expect(observed.image_url).to.equal(image_url);
			expect(observed.subtitle).to.equal(address);
			expect(observed.default_action.type).to.equal('web_url');
			expect(observed.default_action.url).to.equal(website_url);
			expect(observed.buttons[0].url).to.equal(website_url);
			expect(observed.buttons[1].payload).to.equal(contact_number);
		});
		it('fails when the property `name` is not available', () => {
			expect(() => {
				const observed = component.createBasicInfoElement({
					image_url, address, website_url, contact_number
				});
			}).to.throw(EvalError);
		});

		it('fails when the property `address` is not available', () => {
			expect(() => {
				const observed = component.createBasicInfoElement({
					name, image_url, website_url, contact_number
				});
			}).to.throw(EvalError);
		});

		xit('fails when the property `website_url` is not available', () => {
			expect(() => {
				const observed = component.createBasicInfoElement({
					name, address, image_url, contact_number
				});
			}).to.throw(EvalError);
		});
	} : null);

	describe('.createLocationElement()', componentExists && component.createLocationElement ? () => {
		it('fails when the property `latitude` is not available', () => {
			expect(() => {
				const observed = component.createLocationElement({
					longitude
				});
			}).to.throw(EvalError);
		});

		it('fails when the property `longitude` is not available', () => {
			expect(() => {
				const observed = component.createLocationElement({
					latitude
				});
			}).to.throw(EvalError);
		});
	} : null);

	describe('.createOpeningHoursElement()', componentExists && component.createOpeningHoursElement ? () => {
		it('outputs an object with title and subtitle', () => {
			const observed = component.createOpeningHoursElement({
				opening_hours
			});
			expect(observed.title).to.equal('Opening Hours');
			expect(observed.subtitle).to.equal(opening_hours);
		});
	} : null);

	describe('.createGenericPayload()', componentExists && component.createGenericPayload ? () => {
		it('takes in an array of elements and adds it to the elements property of the returned object', () => {
			testInput = ['a', 'b', 'c'];
			const observed = component.createGenericPayload(testInput);
			expect(observed.template_type).to.equal('generic');
			expect(observed.elements).to.deep.equal(testInput);
		});
	} : null);

	describe('.generateReply()', componentExists && component.generateReply ? () => {
		it('takes in a data row from `place` table and returns an object usable in Facebook Messenger\'s API', () => {
			const observed = component.generateReply({
				name, address, image_url, website_url, contact_number, latitude, longitude, opening_hours
			});
			expect(typeof observed).to.equal('object');
		});

		it('generates a valid returned object', () => {
			const observed = component.generateReply({
				name, address, image_url, website_url, contact_number, latitude, longitude, opening_hours
			});
			expect(observed.attachment).to.not.be.undefined;
			expect(observed.attachment.type).to.equal('template');
			expect(observed.attachment.payload).to.not.be.undefined;
		});
	} : null);

	describe('.handle()', componentExists && component.handle ? () => {
		const replySpy = sinon.spy();
		const replyMock = (payload, callback) => {
			replySpy(payload);
			(callback) && callback('err', 'info');
		};
		const callback = sinon.spy();
		const profile = { name: 'profile.name' };

		it('takes in two arguments, `reply` and `profile` and `callback`', () => {
			expect(() => {
				component.handle(() => {}, profile, callback);
			}).to.not.throw();
		});

		it('throws an error if `reply` is not found`', () => {
			expect(() => {
				component.handle(null, profile);
			}).to.throw(EvalError);
		});

		it('throws an error if `profile` is not found`', () => {
			expect(() => {
				component.handle(replyMock);
			}).to.throw(EvalError);
		});

		it('calls callback after it is done processing', (done) => {
			component.handle(replyMock, profile, (err, info) => {
				expect(err).to.equal('err');
				expect(info).to.equal('info');
				done();
			});
		});

		it('calls the supplied `reply` twice', (done) => {
			const preCallReplySpyCallCount  = replySpy.callCount;
			component.handle(replyMock, profile, (err, info) => {
				const postCallReplySpyCallCount  = replySpy.callCount;
				expect(postCallReplySpyCallCount - preCallReplySpyCallCount).to.equal(2);
				done();
			});
		});
	} : null);
});