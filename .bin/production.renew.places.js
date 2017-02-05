const fs = require('fs');
const mysql = require('mysql');
const path = require('path');

const DEVELOPMENT_DB_URL_STRING = 'mysql://127.0.0.1:3306/kopiboy';
const ERROR_INVALID_LOGIN = 'ER_ACCESS_DENIED_ERROR';

const connection = mysql.createConnection(
	process.env.CLEARDB_DATABASE_URL || DEVELOPMENT_DB_URL_STRING
);
connection.connect(err => {
	console.error(err);
	(err && (err.code === ERROR_INVALID_LOGIN)) && (()=>{ throw new Error('Credentials were funky.'); })();
	(!err) && (() => {
		// find the name of the places.js
		const seedersDirectoryListing = fs.readdirSync(
			path.join(process.cwd(), '/seeders')
		);
		const placesSeeders = [];
		for(var i = 0; i < seedersDirectoryListing.length; ++i) {
			const seederFile = seedersDirectoryListing[i];
			if(seederFile.indexOf('places.js') !== -1) {
				placesSeeders.push(seederFile);
				break;
			}
		}

		let processAwaitCounter = 0;
		let processAwaitSuccess = true;
		const processAwaitComplete = function(querySuccessful) {
			processAwaitSuccess &= querySuccessful;
			if(--processAwaitCounter <= 0) {
				process.exit(processAwaitSuccess ? 0 : 1);
			}
		}

		/// delete all rows from places table
		++processAwaitCounter;
		connection.query('DELETE FROM `kopiboy`.`places`;', (err, res) => {
			(err) && (() => { console.error(err); })();
			(!err) && (() => {
				console.log('Places entries removal SUCCESSFUL');
			})();
			processAwaitComplete(err === null);
		});

		/// delete places.js entry in SequelizeData table
		++processAwaitCounter;
		(placesSeeders.length > 0) && (() => {
			let deleteSequelizeDataQuery = 'DELETE FROM `kopiboy`.`SequelizeData` WHERE';
			placesSeeders.forEach(seederFile => {
				deleteSequelizeDataQuery += ` name = ${connection.escape(seederFile)} OR `
			});
			deleteSequelizeDataQuery = deleteSequelizeDataQuery.substr(0, deleteSequelizeDataQuery.length - 4) + ';';
			connection.query(deleteSequelizeDataQuery, (err, results) => {
				(err) && (() => { console.error(err); })();
				(!err) && (() => {
					console.log('SequelizeData entry removal SUCCESSFUL');
				})();
				processAwaitComplete(err === null);
			});
		})();
	})();
});
