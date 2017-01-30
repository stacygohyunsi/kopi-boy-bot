const fs = require('fs');
const csv = require('csvtojson');

const dataImporter = {
	fromCsv(csvFilePath, callback) {
		var totalCafes = [];
		csv()
		.fromFile(csvFilePath)
		.on('json',(jsonObj)=>{
			totalCafes.push(jsonObj);
		})
		.on('done',(error)=>{
			callback(totalCafes);
		});
	}
}

module.exports = dataImporter;