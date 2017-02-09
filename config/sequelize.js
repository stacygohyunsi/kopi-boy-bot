module.exports = {
  "development": {
  	username: "kopiboy",
  	password: "kopiboy",
  	database: "kopiboy",
  	host: "127.0.0.1",
  	dialect: "mysql",
    logging: (() => {}),
    seederStorage: "sequelize"
  },
  "test": {
  	username: process.env.MYSQL_USER,
  	password: process.env.MYSQL_PASSWORD,
  	database: "test",
  	host: "127.0.0.1",
  	dialect: "mysql",
    seederStorage: "sequelize"
  },
  "production": {
    use_env_variable: 'CLEARDB_DATABASE_URL',
		dialect: 'mysql',
    seederStorage: "sequelize"
  }
};

