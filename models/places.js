'use strict';
module.exports = function(sequelize, DataTypes) {
  var places = sequelize.define('places', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
		image_url: DataTypes.STRING,
    contact_number: DataTypes.STRING,
    contact_email: DataTypes.STRING,
    website_url: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    longitude: DataTypes.DOUBLE,
    latitude: DataTypes.DOUBLE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
		hooks: {
			beforeCreate: function(place, options, fn) {
				place.createdAt = new Date();
				place.updatedAt = new Date();
				fn(null, place);
			},
			beforeUpdate: function(place, options, fn) {
				place.updatedAt = new Date();
				fn(null, place);
			}
		}
  });
  return places;
};