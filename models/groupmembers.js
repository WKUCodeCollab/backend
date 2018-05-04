'use strict';
module.exports = (sequelize, DataTypes) => {
  var GroupMembers = sequelize.define('GroupMembers', {}, {});
  GroupMembers.associate = function(models) {
    GroupMembers.belongsTo(models.Group, {
      foreignKey: 'GroupId'
    });
    GroupMembers.belongsTo(models.User, {
      foreignKey: 'UserId'
    });
  };
  return GroupMembers;
};