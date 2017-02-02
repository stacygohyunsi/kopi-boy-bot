'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
		return queryInterface.bulkInsert('places', require('../data/latest.json'), {});
  },
  down: function (queryInterface, Sequelize) {
		return queryInterface.bulkDelete('places', null, {});
  }
};
