const Sequelize = require('sequelize');
const databaseConfig = require('./sequelize');

describe('KopiBoy::Database', () => {
	it('can make a connection to a database', (done) => {
		const configuration = databaseConfig[process.env.NODE_ENV || 'development'];
		const sequelizeInstance = new Sequelize(configuration);
		sequelizeInstance.authenticate().then((errs) => {
			(!errs) && done();
		});
	});
});