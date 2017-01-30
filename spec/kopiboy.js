const fs = require('fs');
const path = require('path');
const should = require('should');
const {expect} = require('chai');

const ACTIONS = require('../actions');
const STRINGS = require('../strings');
const FEATURES = require('../features');

describe('KopiBoy Components', () => {
	context('Welcome Dialog', () => {
		context('button creators', () => {
			it('exists', () => {
				(() => {
					fs.lstatSync(path.resolve('./components/buttons/welcome.js'));
				}).should.not.throw();
			});
		});
		context('strings', () => {
			it('exists', () => {
				expect(STRINGS.CAFE_RANDOM).to.not.be.undefined;
				expect(STRINGS.CAFE_LIST).to.not.be.undefined;
				expect(STRINGS.CAFE_ADD).to.not.be.undefined;
			});
		});
		
	});
});