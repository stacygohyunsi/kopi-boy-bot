const {expect} = require('chai');
const path = require('path');

describe('KopiBoy::Models::Places', () => {
	const expectedComponentLocation = path.resolve('./models');
	let models;

	it('exists', () => {
		expect(() => {
			models = require(expectedComponentLocation);
			expect(models.places).to.not.be.undefined;
		}).to.not.throw();
	});

	describe('structure', () => {
		let columns;
		before((done) => {
			models.places.describe().then((res) => {
				columns = res;
				done();
			});
		})
		it('was created corrently', () => {
			expect(columns).to.have.keys([
				'id',
				'name',
				'address',
				'image_url',
				'contact_number',
				'contact_email',
				'website_url',
				'opening_hours',
				'longitude',
				'latitude',
				'createdAt',
				'updatedAt'
			]);
		})
		it('contains an ID', () => {
			expect(columns).to.contain.key('id');
		});
		it('contains a created time', () => {
			expect(columns).to.contain.key('createdAt');
			expect(columns.createdAt.type).to.be.equal('DATETIME');
		});
		it('contains an updated time', () => {
			expect(columns).to.contain.key('updatedAt');
			expect(columns.updatedAt.type).to.be.equal('DATETIME');
		});
		it('can store a café name', () => {
			expect(columns).to.contain.key('name');
			expect(columns.name.type).to.be.equal('VARCHAR(255)');
		});
		it('can store a café\'s address', () => {
			expect(columns).to.contain.key('address');
			expect(columns.address.type).to.be.equal('VARCHAR(255)');
		});
		it('can store a café\'s image', () => {
			expect(columns).to.contain.key('image_url');
			expect(columns.image_url.type).to.be.equal('VARCHAR(255)');
		});
		it('can store a café\'s contact number', () => {
			expect(columns).to.contain.key('contact_number');
			expect(columns.contact_number.type).to.be.equal('VARCHAR(255)');
		});
		it('can store a café\'s contact email', () => {
			expect(columns).to.contain.key('contact_email');
			expect(columns.contact_email.type).to.be.equal('VARCHAR(255)');
		});
		it('can store a café\'s website URL', () => {
			expect(columns).to.contain.key('website_url');
			expect(columns.website_url.type).to.be.equal('VARCHAR(255)');
		});
		it('can store a café\'s opening hours', () => {
			expect(columns).to.contain.key('opening_hours');
			expect(columns.opening_hours.type).to.be.equal('VARCHAR(255)');
		});
		it('can store a café\'s latitudinal coordinates', () => {
			expect(columns).to.contain.key('latitude');
			expect(columns.latitude.type).to.be.equal('DOUBLE');
		});
		it('can store a café\'s longitudinal coordinates', () => {
			expect(columns).to.contain.key('longitude');
			expect(columns.longitude.type).to.be.equal('DOUBLE');
		});
	});
	
});