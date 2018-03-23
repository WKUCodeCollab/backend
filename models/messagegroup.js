'use strict';
module.exports = (sequelize, DataTypes) => {
  var MessageGroup = sequelize.define('MessageGroup', {}, {});
  MessageGroup.associate = function(models) {
    MessageGroup.belongsTo(models.User, {
      foreignKey: 'user1'
    });
    MessageGroup.belongsTo(models.User, {
      foreignKey: 'user2'
    });
    MessageGroup.hasMany(models.Message, {
      foreignKey: 'groupID',
      as: 'messageGroupMessage'
    });
  };
  return MessageGroup;
};