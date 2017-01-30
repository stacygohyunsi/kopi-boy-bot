'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('places', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
			image_url: {
				type: Sequelize.STRING
			},
      contact_number: {
        type: Sequelize.STRING
      },
      contact_email: {
        type: Sequelize.STRING
      },
			website_url: {
        type: Sequelize.STRING
      },
      opening_hours: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.DOUBLE
      },
      latitude: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('places');
  }
};