const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const path = require('path');
const sinon = require('sinon');

const Actions = require('./index');
const ReviewChecker = require('../review-checker');
const Strings = require('../strings');
const Utility = require('./utility');

describe('KopiBoy::Components::Actions::WithinProximity', () => {
	const expectedComponentLocation = path.join(__dirname, './within-proximity.js');
	let component = null;
	try {
		component = require(expectedComponentLocation);
	} catch(ex) { }

	it('exists at the correct location', () => {
		expect(() => {
			require(expectedComponentLocation)
		}).to.not.throw();
	});

	it('implements the correct functions', () => {
		const expectedComponentKeys = [
			'createBasicInfoElement',
			'createOpeningHoursElement',
			'createReply',
			'createReviewsElement',
			'createReviewWebsitesButtons',
			'generateMessageElement',
			'generate200mElement',
			'generate500mElement',
			'generate2kmElement',
			'generateReply',
			'handleLocationRequest',
			'handle200mRandom',
			'handle500mRandom',
			'handle2kmRandom',
			'handleNevermind',
			'handleRandom'
		];
		const observedComponentKeys = Object.keys(component);
		expect(observedComponentKeys).to.deep.equal(expectedComponentKeys);
		expectedComponentKeys.forEach(fn => {
			expect(fn).to.be.a.function;
		})
	});

	describe('.createBasicInfoElement()', () => {
		let place;

		before(() => {
			place = {
				name: 'place.name',
				image_url: 'place.image_url',
				address: 'place.address',
				website_url: 'place.website_url',
				latitude: 0.1111,
				longitude: 0.2222
			};
		});

		it('throws an error when the property `name` is not available in the `place` parameter', () => {
			expect(() => {
				component.createBasicInfoElement({
					address: ''
				});
			}).to.throw(EvalError);
		});

		it('throws an error when the property `address` is not available in the `place` parameter', () => {
			expect(() => {
				component.createBasicInfoElement({
					name: ''
				});
			}).to.throw(EvalError);
		});

		it('returns an object with the correct properties when `place` is fully populated', () => {
			const observed = component.createBasicInfoElement(place);
			expect(observed.title).to.deep.equal(place.name);
			expect(observed.image_url).to.deep.equal(place.image_url);
			expect(observed.subtitle).to.deep.equal(place.address);
			expect(observed.default_action.url).to.deep.equal(place.website_url);
			expect(observed.default_action.type).to.deep.equal('web_url');
			expect(observed.buttons).to.have.length(3);
		});

		it('returns an object with the correct properties when `place` lacks location coordinates', () => {
			const placeWithoutLatitude = Object.assign({}, place);
			delete placeWithoutLatitude['latitude'];
			const observed = component.createBasicInfoElement(placeWithoutLatitude);
			expect(observed.buttons).to.have.length(2);
			expect(observed.buttons[0].title).to.deep.equal(Strings.SHOW_ANOTHER);
			expect(observed.buttons[1].title).to.deep.equal(Strings.WITHIN_NEVERMIND);
		});

		it('returns an object with the correct properties when `place` lacks a website URL', () => {
			const placeWithoutWebsite = Object.assign({}, place);
			delete placeWithoutWebsite['website_url'];
			const observed = component.createBasicInfoElement(placeWithoutWebsite);
			expect(observed.buttons).to.have.length(3);
			expect(observed.buttons[0].title).to.deep.equal(Strings.GET_DIRECTIONS);
			expect(observed.buttons[1].title).to.deep.equal(Strings.SHOW_ANOTHER);
			expect(observed.buttons[2].title).to.deep.equal(Strings.WITHIN_NEVERMIND);
		});

		it('returns an object with the correct properties when `place` lacks both website URL and location coordinates', () => {
			const minimalPlace = Object.assign({}, place);
			delete minimalPlace['latitude'];
			delete minimalPlace['website_url'];
			const observed = component.createBasicInfoElement(minimalPlace);
			expect(observed.buttons).to.have.length(2);
			expect(observed.buttons[0].title).to.deep.equal(Strings.SHOW_ANOTHER);
			expect(observed.buttons[1].title).to.deep.equal(Strings.WITHIN_NEVERMIND);			
		});
	});

	describe('.createOpeningHoursElement()', () => {
		let place;

		before(() => {
			place = {
				contact_number: 'place.contact_number',
				contact_email: 'place.contact_email',
				opening_hours: 'place.opening_hours'
			};
		});

		it('throws an error when the `place` parameter is not provided', () => {
			expect(() => {
				component.createOpeningHoursElement();
			}).to.throw(EvalError);
		});

		it('returns the correct object when a fully populated `place` is provided', () => {
			const observed = component.createOpeningHoursElement(place);
			expect(observed.title).to.deep.equal(Strings.LABEL_OPENING_HOURS);
			expect(observed.subtitle).to.deep.equal(place.opening_hours);
			expect(observed.buttons).to.have.length(2);
			expect(observed.buttons[0].title).to.deep.equal(Strings.CALL_THIS_CAFE);
			expect(observed.buttons[0].payload).to.deep.equal(place.contact_number);
			expect(observed.buttons[0].type).to.deep.equal('phone_number');
			expect(observed.buttons[1].title).to.deep.equal(Strings.EMAIL_THIS_CAFE);
			expect(observed.buttons[1].payload).to.deep.equal(`mailto:${place.contact_email}`);
			expect(observed.buttons[1].type).to.deep.equal('web_url');
		});

		it('returns the correct object when a `place` without Opening Hours is provided', () => {
			const placeWithoutOpeningHours = Object.assign({}, place);
			delete placeWithoutOpeningHours['opening_hours'];
			const observed = component.createOpeningHoursElement(placeWithoutOpeningHours);
			expect(observed.title).to.deep.equal(Strings.LABEL_OPENING_HOURS);
			expect(observed.subtitle).to.deep.equal(Strings.LABEL_OPENING_HOURS_UNAVAILABLE);
			expect(observed.buttons).to.have.length(2);
			expect(observed.buttons[0].title).to.deep.equal(Strings.CALL_THIS_CAFE);
			expect(observed.buttons[0].payload).to.deep.equal(place.contact_number);
			expect(observed.buttons[0].type).to.deep.equal('phone_number');
			expect(observed.buttons[1].title).to.deep.equal(Strings.EMAIL_THIS_CAFE);
			expect(observed.buttons[1].payload).to.deep.equal(`mailto:${place.contact_email}`);
			expect(observed.buttons[1].type).to.deep.equal('web_url');
		});

		it('returns the correct object when a `place` without Email is provided', () => {
			const placeWithoutEmail = Object.assign({}, place);
			delete placeWithoutEmail['contact_email'];
			const observed = component.createOpeningHoursElement(placeWithoutEmail);
			expect(observed.title).to.deep.equal(Strings.LABEL_OPENING_HOURS);
			expect(observed.subtitle).to.deep.equal(place.opening_hours);
			expect(observed.buttons).to.have.length(1);
			expect(observed.buttons[0].title).to.deep.equal(Strings.CALL_THIS_CAFE);
			expect(observed.buttons[0].payload).to.deep.equal(place.contact_number);
			expect(observed.buttons[0].type).to.deep.equal('phone_number');
		});

		it('returns the correct object when a `place` without Number is provided', () => {
			const placeWithoutNumber = Object.assign({}, place);
			delete placeWithoutNumber['contact_number'];
			const observed = component.createOpeningHoursElement(placeWithoutNumber);
			expect(observed.title).to.deep.equal(Strings.LABEL_OPENING_HOURS);
			expect(observed.subtitle).to.deep.equal(place.opening_hours);
			expect(observed.buttons).to.have.length(1);
			expect(observed.buttons[0].title).to.deep.equal(Strings.EMAIL_THIS_CAFE);
			expect(observed.buttons[0].payload).to.deep.equal(`mailto:${place.contact_email}`);
			expect(observed.buttons[0].type).to.deep.equal('web_url');
		});

		it('returns the correct object when there is no Number, Email or Opening Hours', () => {
			const observed = component.createOpeningHoursElement({});
			expect(observed.title).to.deep.equal(Strings.LABEL_OPENING_HOURS);
			expect(observed.subtitle).to.deep.equal(Strings.LABEL_OPENING_HOURS_UNAVAILABLE);
			expect(Object.keys(observed)).to.deep.equal(['title', 'subtitle']);
		});
	});

	describe('.createReply()', () => {
		it('returns a payload with template of type `list`', () => {
			const observed = component.createReply('name');
			const { attachment } = observed;
			expect(attachment.type).to.equal('template');
			expect(attachment.payload.template_type).to.equal('list');
		});

		it('returns a payload with not more than 4 elements', () => {
			const observed = component.createReply('name');
			const { attachment } = observed;
			expect(attachment.payload.elements.length).to.be.lessThan(5);
		});

		it('has a returned list of elements where the user\'s name is in the first message element', () => {
			const observed = component.createReply('name');
			const { attachment } = observed;
			expect(attachment.payload.elements[0].title).to.contain('name');
		});

		it('calls .generateMessageElement() once', () => {
			const generateMessageElementSpy = sinon.stub(component, 'generateMessageElement');
			component.createReply('name');
			expect(generateMessageElementSpy).to.be.calledOnce;
			generateMessageElementSpy.restore();
		});

		it('calls .generate200mElement() once', () => {
			const generate200mElementSpy = sinon.stub(component, 'generate200mElement');
			component.createReply('name');
			expect(generate200mElementSpy).to.be.calledOnce;
			generate200mElementSpy.restore();
		});

		it('calls .generate500mElement() once', () => {
			const generate500mElementSpy = sinon.stub(component, 'generate500mElement');
			component.createReply('name');
			expect(generate500mElementSpy).to.be.calledOnce;
			generate500mElementSpy.restore();
		});

		it('calls .generate2kmElement() once', () => {
			const generate2kmElementSpy = sinon.stub(component, 'generate2kmElement');
			component.createReply('name');
			expect(generate2kmElementSpy).to.be.calledOnce;
			generate2kmElementSpy.restore();
		});
	});

	describe('.createReviewsElement()', () => {
		let place;

		before(() => {
			place = {
				name: 'place.name'
			};
		});

		it('throws an error if the `place` argument does not exist', () => {
			expect(() => {
				component.createReviewsElement();
			}).to.throw(EvalError);
		});

		it('throws an error if property `name` of the `place` argument does not exist', () => {
			expect(() => {
				component.createReviewsElement({});
			}).to.throw(EvalError);
		});

		it('returns the correct object if the `place` argument was provided correctly', () => {
			const observed = component.createReviewsElement(place);
			expect(observed.title).to.deep.equal(Strings.LABEL_REVIEWS);
			expect(observed.subtitle).to.deep.equal(Strings.LABEL_REVIEWS_MORE);
			expect(observed.buttons).to.have.length(3);
			expect(observed.buttons[0].title).to.deep.equal(Strings.CHECKOUT_BURPPLE_REVIEWS);
			expect(observed.buttons[1].title).to.deep.equal(Strings.CHECKOUT_HUNGRYGOWHERE_REVIEWS);
			expect(observed.buttons[2].title).to.deep.equal(Strings.CHECKOUT_YELP_REVIEWS);
		});
	});

	describe('.createReviewWebsitesButtons()', () => {
		it('throws an error if `cafeName` parameter is not a string', () => {
			expect(() => { component.createReviewWebsitesButtons(); }).to.throw(EvalError);
			expect(() => { component.createReviewWebsitesButtons(1); }).to.throw(EvalError);
			expect(() => { component.createReviewWebsitesButtons('string'); }).to.not.throw();
		})

		it('returns an object with the correct properties', () => {
			expect(component.createReviewWebsitesButtons('cafe_name')).to.have.keys([
				'burpple', 'hungryGoWhere', 'yelp'
			]);
		})
	});

	describe('.generateMessageElement()', () => {
		it('returns an element with a title and image', () => {
			const observed = component.generateMessageElement();
			expect(observed.title).to.be.okay;
			expect(observed.title).to.be.a.string;
			expect(observed.image_url).to.be.okay;
			expect(observed.image_url).to.be.a.string;
		});

		it('includes the user\'s name in the title if the `name` parameter is specified', () => {
			const observed = component.generateMessageElement('name');
			expect(observed.title).to.contain('name');
		});

		it('includes an endearing term for the user in the title if the `name` parameter is specified', () => {
			const observed = component.generateMessageElement();
			expect(observed.title).to.contain('dear user');
		});
	});

	describe('.generate200mElement()', () => {
		it('returns an element with a title, subtitle and buttons', () => {
			const observed = component.generate200mElement();
			expect(observed.title).to.be.okay;
			expect(observed.title).to.be.a.string;
			expect(observed.subtitle).to.be.okay;
			expect(observed.subtitle).to.be.a.string;
			expect(observed.buttons).to.be.instanceOf(Array);
			expect(observed.buttons).to.have.length(1);
		});
	});

	describe('.generate500mElement()', () => {
		it('returns an element with a title, subtitle and buttons', () => {
			const observed = component.generate500mElement();
			expect(observed.title).to.be.okay;
			expect(observed.title).to.be.a.string;
			expect(observed.subtitle).to.be.okay;
			expect(observed.subtitle).to.be.a.string;
			expect(observed.buttons).to.be.instanceOf(Array);
			expect(observed.buttons).to.have.length(1);
		});
	});

	describe('.generate2kmElement()', () => {
		it('returns an element with a title, subtitle and buttons', () => {
			const observed = component.generate2kmElement();
			expect(observed.title).to.be.okay;
			expect(observed.title).to.be.a.string;
			expect(observed.subtitle).to.be.okay;
			expect(observed.subtitle).to.be.a.string;
			expect(observed.buttons).to.be.instanceOf(Array);
			expect(observed.buttons).to.have.length(1);
		});
	});

	describe('.generateReply()', () => {
		let createBasicInfoElementSpy;
		let createOpeningHoursElementSpy;
		let createReviewsElementSpy;
		let generateGenericTemplateTypeSpy;
		let generateTemplateAttachmentSpy;
		let place;

		before(() => {
			createBasicInfoElementSpy = sinon.stub(component, 'createBasicInfoElement');
			createOpeningHoursElementSpy = sinon.stub(component, 'createOpeningHoursElement');
			createReviewsElementSpy = sinon.stub(component, 'createReviewsElement');
			place = {
				name: 'place.name',
				image_url: 'place.image_url',
				address: 'place.address',
				website_url: 'place.website_url',
				contact_number: 'place.contact_number',
				contact_email: 'place.contact_email',
				opening_hours: 'place.opening_hours',
				latitude: 0.1111,
				longitude: 0.2222
			};
		});

		afterEach(() => {
			createBasicInfoElementSpy.reset();
			createOpeningHoursElementSpy.reset();
			createReviewsElementSpy.reset();
		});

		after(() => {
			createBasicInfoElementSpy.restore();
			createOpeningHoursElementSpy.restore();
			createReviewsElementSpy.restore();
		});

		it('calls createBasicInfoElement', () => {
			component.generateReply(place);
			expect(createBasicInfoElementSpy).to.have.been.calledOnce;
		});

		it('calls createOpeningHoursElement', () => {
			component.generateReply(place);
			expect(createOpeningHoursElementSpy).to.have.been.calledOnce;
		});

		it('does not call createOpeningHoursElement if opening hours are not available', () => {
			const placeWithoutOpeningHours = Object.assign({}, place);
			delete placeWithoutOpeningHours['opening_hours'];
			component.generateReply(placeWithoutOpeningHours);
			expect(createOpeningHoursElementSpy).to.not.have.been.called;
		});

		it('calls createReviewsElement', () => {
			component.generateReply(place);
			expect(createReviewsElementSpy).to.have.been.calledOnce;
		});
	});

	describe('.handleLocationRequest()', () => {
		const reply = sinon.spy();
		const profile = {
			first_name: 'profile.name'
		};

		afterEach(() => {
			reply.reset();
		});

		it('takes in a `reply` function and a `profile` object as arguments', () => {
			expect(() => {
				component.handleLocationRequest(reply, profile);
			}).to.not.throw();
		});

		it('throws an exception if `reply` function is not present', () => {
			expect(() => {
				component.handleLocationRequest(null, profile);
			}).to.throw(EvalError);
		});

		it('throws an exception if `profile` object is not present', () => {
			expect(() => {
				component.handleLocationRequest(reply, null);
			}).to.throw(EvalError);
		});

		it('calls `reply` with the right parameters', () => {
			component.handleLocationRequest(reply, profile);
			expect(reply).to.have.been.calledWith({
				text: Strings.LOCATION_REQUEST.replace(Strings.KEYS.NAME, profile.first_name)
			})
		});
	});

	describe('.handle<DISTANCE>Random()', () => {
		let handleLocationRequestMock;
		const reply = sinon.spy();
		const profile = {
			first_name: 'profile.name'
		};

		before(() => {
			handleLocationRequestMock = sinon.stub(component, 'handleLocationRequest');
		});

		afterEach(() => {
			handleLocationRequestMock.reset();
		});

		after(() => {
			handleLocationRequestMock.restore();
		});

		xit('calls handleLocationRequest for 200m', () => {
			component.handle200mRandom(reply, profile);
			expect(handleLocationRequestMock).to.have.been.calledOnce;
		});

		xit('calls handleLocationRequest for 500m', () => {
			component.handle500mRandom(reply, profile);
			expect(handleLocationRequestMock).to.have.been.calledOnce;
		});

		xit('calls handleLocationRequest for 2km', () => {
			component.handle2kmRandom(reply, profile);
			expect(handleLocationRequestMock).to.have.been.calledOnce;
		});
	});

	describe('.handleLocationReception()', () => {
		const reply = sinon.spy();
		const profile = {};
		const payload = {};
		const coordinates = {};

		it('throws an exception if `reply` function is not present', () => {
			expect(() => {
				component.handleLocationReception(null, profile, payload, coordinates);
			}).to.throw(TypeError);
		});

		it('throws an exception if `profile` object is not present', () => {
			expect(() => {
				component.handleLocationReception(reply, null, payload, coordinates);
			}).to.throw(TypeError);
		});

		it('throws an exception if `payload` object is not present', () => {
			expect(() => {
				component.handleLocationReception(reply, profile, null, coordinates);
			}).to.throw(TypeError);
		});

		it('throws an exception if `coordinates` object is not present', () => {
			expect(() => {
				component.handleLocationReception(reply, profile, payload, null);
			}).to.throw(TypeError);
		});

	});

	describe('.handleRandom()', () => {
		const reply = sinon.spy();
		const profile = {};

		it('takes in a `reply` function and a `profile` object as arguments', () => {
			expect(() => {
				component.handleRandom(reply, profile);
			}).to.not.throw();
		});

		it('throws an exception if `reply` function is not present', () => {
			expect(() => {
				component.handleRandom(null, profile);
			}).to.throw(EvalError);
		});

		it('throws an exception if `profile` object is not present', () => {
			expect(() => {
				component.handleRandom(reply, null);
			}).to.throw(EvalError);
		});

		it('will call reply once with a payload containing four elements for a message, 200m, 500m and 2km', () => {
			const preCallCount = reply.callCount;
			component.handleRandom(reply, profile);
			const postCallCount = reply.callCount;
			const { attachment } = reply.args[reply.args.length - 1][0];
			expect(postCallCount - preCallCount).to.equal(1);
		});


	});
});
