'use strict';
module.exports = (sequelize, DataTypes) => {
  var FriendRequests = sequelize.define('FriendRequests', {}, {});
  FriendRequests.associate = function(models) {
    FriendRequests.belongsTo(models.User, {
      foreignKey: 'sentBy'
    });
    FriendRequests.belongsTo(models.User, {
      foreignKey: 'receivedBy'
    });
  };
  return FriendRequests;
};