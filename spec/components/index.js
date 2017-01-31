describe('KopiBoy::Components', () => {
	it('has a Data Importer [#138593941]', () => {
		(() => {
			dataImporter = require('../../components/data-importer');
		}).should.not.throw();
	});
	it('has a Location Calculator [#138614499]', () => {
		(() => {
			locationCalculator = require('../../components/location-calculator');
		}).should.not.throw();
	});
});