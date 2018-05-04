const models = require('../models');
const Promise = require('bluebird');

module.exports.getUsersGroups = (userId) => new Promise(async(resolve, reject) => {
    try{
      console.log(userId);  
      const data = await models.GroupMembers.findAll({where: {UserId: userId}});
        resolve(data);
    } catch(err) {
        reject(err);
    }
});

module.exports.getGroupMembers = (groupId) => new Promise(async( resolve, reject) => {
    try{
        const data = await models.GroupMembers.findAll({where: {GroupId: groupId}});
        resolve (data);
    }catch(err) {
        reject(err);
    }
});