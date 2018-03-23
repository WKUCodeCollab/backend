'use strict';
module.exports = (sequelize, DataTypes) => {
  var Group = sequelize.define('Group', {
    currentCode: DataTypes.TEXT,
    members: DataTypes.BLOB
  }, {});
  Group.associate = function(models) {
    Group.belongsTo(models.User, {
      foreignKey: 'creator'
    });
  };
  return Group;
};