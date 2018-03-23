'use strict';
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define('Message', {
    message: DataTypes.STRING
  }, {});
  Message.associate = function(models) {
    Message.belongsTo(models.User, {
      foreignKey: 'sentBy'
    });
    Message.belongsTo(models.MessageGroup, {
      foreignKey: 'groupID'
    });
  };
  return Message;
};