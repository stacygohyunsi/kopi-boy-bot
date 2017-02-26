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
			error && callback(error, null);
			!error && callback(null, totalCafes);
		});
	}
}

module.exports = dataImporter;