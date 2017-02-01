const fs = require('fs');
const path = require('path');
const dataImporter = require("../components/data-importer.js");

dataImporter.fromCsv(path.join(__dirname,"../data/latest.csv"), function(err, totalCafes) {
	if (err) {
		console.log("ERR");
		console.log(err);
	} else {
		fs.writeFile(path.join(__dirname,'../data/latest.json'), JSON.stringify(totalCafes), 'utf8', function(err) {
			if (err) {
				console.log("ERR");
				console.log(err);
			}
		});
	}
});