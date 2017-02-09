const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const path = require('path');
const sinon = require('sinon');

const Actions = require('./index');
const ReviewChecker = require('../review-checker');

describe('KopiBoy::Components::Actions::WithinProximity', () => {
	const expectedComponentLocation = path.join(__dirname, './within-proximity.js');
	let componentExists = false;
	let component = null;
	try {
		component = require(expectedComponentLocation);
		componentExists = true;
	} catch(ex) { }

	it('exists at the correct location', () => {
		expect(() => {
			require(expectedComponentLocation)
		}).to.not.throw();
	});

	it('implements .generateMessageElement()', componentExists ? () => {
		expect(component.generateMessageElement).to.not.be.undefined;
		expect(component.generateMessageElement).to.be.a.function;
	} : null);

	it('implements .generate200mElement()', componentExists ? () => {
		expect(component.generate200mElement).to.not.be.undefined;
		expect(component.generate200mElement).to.be.a.function;
	} : null);

	it('implements .generate500mElement()', componentExists ? () => {
		expect(component.generate500mElement).to.not.be.undefined;
		expect(component.generate500mElement).to.be.a.function;
	} : null);

	it('implements .generate2kmElement()', componentExists ? () => {
		expect(component.generate2kmElement).to.not.be.undefined;
		expect(component.generate2kmElement).to.be.a.function;
	} : null);

	it('implements .createReply()', componentExists ? () => {
		expect(component.createReply).to.not.be.undefined;
		expect(component.createReply).to.be.a.function;
	} : null);

	it('implements .handleRandom()', componentExists ? () => {
		expect(component.handleRandom).to.not.be.undefined;
		expect(component.handleRandom).to.be.a.function;
	} : null);

	describe('.generateMessageElement()', componentExists && component.generate200mElement ? () => {
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
	}: null);

	describe('.generate200mElement()', componentExists && component.generate200mElement ? () => {
		it('returns an element with a title, subtitle and buttons', () => {
			const observed = component.generate200mElement();
			expect(observed.title).to.be.okay;
			expect(observed.title).to.be.a.string;
			expect(observed.subtitle).to.be.okay;
			expect(observed.subtitle).to.be.a.string;
			expect(observed.buttons).to.be.instanceOf(Array);
			expect(observed.buttons).to.have.length(1);
		});
	}: null);

	describe('.generate500mElement()', componentExists && component.generate500mElement ? () => {
		it('returns an element with a title, subtitle and buttons', () => {
			const observed = component.generate500mElement();
			expect(observed.title).to.be.okay;
			expect(observed.title).to.be.a.string;
			expect(observed.subtitle).to.be.okay;
			expect(observed.subtitle).to.be.a.string;
			expect(observed.buttons).to.be.instanceOf(Array);
			expect(observed.buttons).to.have.length(1);
		});
	}: null);

	describe('.generate2kmElement()', componentExists && component.generate2kmElement ? () => {
		it('returns an element with a title, subtitle and buttons', () => {
			const observed = component.generate2kmElement();
			expect(observed.title).to.be.okay;
			expect(observed.title).to.be.a.string;
			expect(observed.subtitle).to.be.okay;
			expect(observed.subtitle).to.be.a.string;
			expect(observed.buttons).to.be.instanceOf(Array);
			expect(observed.buttons).to.have.length(1);
		});
	}: null);

	describe('.createReply()', componentExists && component.createReply ? () => {
		it('returns a payload with template of type `list`', () => {
			const observed = component.createReply('name');
			const {attachment} = observed;
			expect(attachment.type).to.equal('template');
			expect(attachment.payload.template_type).to.equal('list');
		});

		it('returns a payload with not more than 4 elements', () => {
			const observed = component.createReply('name');
			const {attachment} = observed;
			expect(attachment.payload.elements.length).to.be.lessThan(5);
		});

		it('has a returned list of elements where the user\'s name is in the first message element', () => {
			const observed = component.createReply('name');
			const {attachment} = observed;
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
	}: null);

	describe('.handleRandom()', componentExists && component.handleRandom ? () => {
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
			const {attachment} = reply.args[reply.args.length - 1][0];
			expect(postCallCount - preCallCount).to.equal(1);
			console.log(attachment.payload.buttons);
		});


	} : null);
});
