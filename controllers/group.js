const models = require('../models');
const membersController = require('./groupmembers');
const Promise = require('bluebird');

module.exports.getGroupById = id => new Promise(async (resolve, reject) => {
    try {
        const group = await models.Group.findById(id);
        resolve(group);
    } catch (err) {
        reject(err);
    }
});

module.exports.createGroup = userId => new Promise(async (resolve, reject) => {
    try{
        let group = await models.Group.build({
            creator: userId
        });
        let data = group.save();
        await membersController.addGroupMember(userId);
        resolve(data);
    } catch(err) {
        reject(err);
    }
});

module.exports.deleteGroup = id => new Promise(async (resolve, reject) => {
    try {
        const data = await models.Group.destroy({
            where: { id: id },
            limit: 1,
        });
        resolve(data);
    } catch (err) {
        reject(err);
    }
});

module.exports.saveCode = (newCode, groupId) => new Promise(async (resolve, reject) => {
    try{
        let data = await models.Group.update(
            {code: newCode},
            {where: {id: groupId}}
        );
        resolve(data);
    }catch(err) {
        reject(err);
    }
});