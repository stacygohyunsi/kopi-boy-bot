const fs = require('fs');
const path = require('path');
const {expect} = require('chai');

describe('KopiBoy::Components::DataImporter [#138593941]', () => {
	const expectedComponentLocation = path.join(process.cwd(), '/components/data-importer.js');
	let testDataKeys = ['a', 'b', 'c', 'd', 'e'];
	let testDataRows = [
		[1, 2, 3, 4, 5],
		[2, 3, 4, 5, 6],
		[3, 4, 5, 6, 7],
		[4, 5, 6, 7, 8],
		[5, 6, 7, 8, 9]
	]
	let testData = `${testDataKeys}\n${testDataRows[0]}\n${testDataRows[1]}\n${testDataRows[2]}\n${testDataRows[3]}\n${testDataRows[4]}`;
	let currentModule = {};

	it('is located in the right position', () => {
		expect(() => {
			currentModule = require(expectedComponentLocation);
		}).to.not.throw();
	});

	it('implements .fromCsv()', () => {
		expect(currentModule.fromCsv).to.not.be.undefined;
	});

	describe('.fromCsv()', () => {
		const currentWorkingDirectory = process.cwd();
		const tmpDirectory = path.join(currentWorkingDirectory, '/tmp');
		const tmpFile = path.join(tmpDirectory, '/test.csv');

		before(() => {	
			try {
				fs.mkdirSync(tmpDirectory);
			} catch(ex) {
				console.warn(ex);
			}
			try {
				fs.writeFileSync(tmpFile, testData);
			} catch(ex) {
				console.warn(ex);
			}
		});

		beforeEach(() => {
			expect(() => {
				fs.lstatSync(tmpFile);
			}).to.not.throw();
		});

		after(() => {
			fs.unlinkSync(tmpFile);
			fs.rmdirSync(tmpDirectory);
		})

		it('takes in two arguments, a path to a CSV file and a callback with signature (error : Error, data : Array)', (done) => {
			let asyncExpectCount = 2;

			currentModule.fromCsv(tmpFile, (error, data) => {
				expect(error).to.be.null;
				expect(data instanceof Array).to.be.true;
				((--asyncExpectCount) === 0) && done();
			});
			currentModule.fromCsv(path.resolve('./non-existent-file.txt'), (error, data) => {
				expect(error instanceof Error).to.be.true;
				expect(data).to.be.null;
				((--asyncExpectCount) === 0) && done();
			});
		});

		it('returns an Array in the callback which uses the first row of the CSV as keys and the other rows as values', (done) => {
			let asyncExpectCount = 1;
			currentModule.fromCsv(tmpFile, (error, data) => {
				expect(data instanceof Array).to.be.true;
				expect(data[0]).to.have.keys(testDataKeys);
				const expectedDataStructure = {};
				testDataKeys.forEach(key => { expectedDataStructure[key] = null; });
				for(var i = 0; i < data.length; ++i) {
					testDataRows[i].forEach((value, index) => {
						expectedDataStructure[testDataKeys[index]] = value;
					});
					expect(data[i]).to.deep.equal(expectedDataStructure);
				}
				((--asyncExpectCount) === 0) && done();
			});
		});
	});
});