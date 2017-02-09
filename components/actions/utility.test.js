const path = require('path');
const {expect} = require('chai');

describe('KopiBoy::Components::Utility', () => {
	const expectedComponentLocation = path.join(__dirname, './utility.js');
	let componentExists = false;
	let component = null;
	try {
		component = require(expectedComponentLocation);
		componentExists = true;
	} catch(ex) { }
	
	it('exists at the right location', () => {
		expect(() => {
			require(expectedComponentLocation);
		}).to.not.throw();
	});

	it('implements .generateGenericTemplateType()', () => {
		expect(component.generateGenericTemplateType).to.not.be.undefined;
		expect(component.generateGenericTemplateType).to.be.a.function;
	});

	it('implements .generateListTemplateType()', () => {
		expect(component.generateListTemplateType).to.not.be.undefined;
		expect(component.generateListTemplateType).to.be.a.function;
	});

	it('implements .generatePostbackButton()', () => {
		expect(component.generatePostbackButton).to.not.be.undefined;
		expect(component.generatePostbackButton).to.be.a.function;
	});

	it('implements .generateTemplateAttachment()', () => {
		expect(component.generateTemplateAttachment).to.not.be.undefined;
		expect(component.generateTemplateAttachment).to.be.a.function;
	});

	it('implements .generateWebUrlButton()', () => {
		expect(component.generateWebUrlButton).to.not.be.undefined;
		expect(component.generateWebUrlButton).to.be.a.function;
	});

	describe('.generateGenericTemplateType()', () => {
		it('takes in an array of elements and adds it to the elements property of the returned object', () => {
			testInput = ['a', 'b', 'c'];
			const observed = component.generateGenericTemplateType(testInput);
			expect(observed.template_type).to.equal('generic');
			expect(observed.elements).to.deep.equal(testInput);
		});
	});

	describe('.generateListTemplateType()', () => {
		it('takes in an array of elements and adds it to the elements property of the returned object', () => {
			const testInputElements = ['a', 'b', 'c'];
			const testInputButtons = ['b', 'u', 't', 't', 'o', 'n', 's'];
			const observed = component.generateListTemplateType(testInputElements, testInputButtons);
			expect(observed.template_type).to.equal('list');
			expect(observed.elements).to.deep.equal(testInputElements);
			expect(observed.buttons).to.deep.equal(testInputButtons);
		});
	});

	describe('.generatePostbackButton()', () => {
		it('takes in an array of elements and adds it to the elements property of the returned object', () => {
			const testInputPayload = 'input-payload';
			const testInputTitle = 'input-title';
			const observed = component.generatePostbackButton(testInputPayload, testInputTitle);
			expect(observed.type).to.equal('postback');
			expect(observed.payload).to.deep.equal(testInputPayload);
			expect(observed.title).to.deep.equal(testInputTitle);
		});
	});
});
