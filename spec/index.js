const fs = require('fs');
const path = require('path');
const should = require('should');
const {expect} = require('chai');

describe('KopiBoy', () => {
	let actions,
		features,
		models,
		strings,
		dataImporter,
		locationCalculator;
	context('Components', () => {
		it('has Actions', () => {
			(() => {
				actions = require('../actions');
			}).should.not.throw();
		});
		it('has Features', () => {
			(() => {
				features = require('../features');
			}).should.not.throw();
		});
		it('has Strings', () => {
			(() => {
				strings = require('../strings');
			}).should.not.throw();
		});
	});
	context('Introduction', () => {
		context('button creators', () => {
			it('exists', () => {
				(() => {
					fs.lstatSync(path.resolve('./components/buttons/welcome.js'));
				}).should.not.throw();
			});
		});
	});
	context('Primary Actions', () => {

	});
	context('Random Café', () => {
		it('has associated Action', () => {
			expect(actions.CAFE_RANDOM).to.not.be.undefined;
		});
	});
	context('List all Cafés', () => {
		it('has associated Action', () => {
			expect(actions.CAFE_LIST).to.not.be.undefined;
		});
	});
	context('Add a new Café', () => {
		it('has associated Action', () => {
			expect(actions.CAFE_ADD).to.not.be.undefined;
		});
	});
	context('In the Vicinity', () => {
		it('has associated Action', () => {
			expect(actions.WITHIN_NEARBY).to.not.be.undefined;
		});
	});
	context('Within user\'s Country', () => {
		it('has associated Action', () => {
			expect(actions.WITHIN_COUNTRY).to.not.be.undefined;
		});
	})
});