'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAuthenticated: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Friends, {
      foreignKey: 'sentBy',
      as: 'userSentByFriends'
    });
    User.hasMany(models.Friends, {
      foreignKey: 'acceptedBy',
      as: 'userAcceptedByFriends'
    });
    User.hasMany(models.FriendRequests, {
      foreignKey: 'sentBy',
      as: 'userSentByFriendRequests'
    });
    User.hasMany(models.FriendRequests, {
      foreignKey: 'receivedBy',
      as: 'userReceivedByFriendRequests'
    });
    User.hasMany(models.Group, {
      foreignKey: 'creator',
      as: 'userCreator'
    });
    User.hasMany(models.MessageGroup, {
      foreignKey: 'user1',
      as: 'userMessage1'
    });
    User.hasMany(models.MessageGroup, {
      foreignKey: 'user2',
      as: 'userMessage2'
    });
    User.hasMany(models.Message, {
      foreignKey: 'sentBy',
      as: 'userSentByMessage'
    });
  };
  return User;
};