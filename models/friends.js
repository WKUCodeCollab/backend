'use strict';
module.exports = (sequelize, DataTypes) => {
  var Friends = sequelize.define('Friends', {}, {});
  Friends.associate = function(models) {
    Friends.belongsTo(models.User, {
      foreignKey: 'sentBy'
    });
    Friends.belongsTo(models.User, {
      foreignKey: 'acceptedBy'
    });
  };
  return Friends;
};