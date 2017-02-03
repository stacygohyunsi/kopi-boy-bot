const {expect} = require('chai');
const path = require('path');

describe('KopiBoy::Components::Actions::WithinCountry', () => {
	const expectedComponentLocation = path.join(__dirname, './within-country.js');
	let componentExists = false;
	let component = null;
	try {
		component = require(expectedComponentLocation);
		componentExists = true;
	} catch(ex) { }

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
			const name = 'name';
			const image_url = 'image_url';
			const address = 'address';
			const website_url = 'website_url';
			const contact_number = 'contact_number';

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
	} : null);
});