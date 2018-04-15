const models = require('../models');
const Promise = require('bluebird');

module.exports.createGroup = userId => new Promise(async (resolve, reject) => {
    try{
        let group = await models.Group.build({
            creator: userId
        });
        let data = group.save();
        resolve(data);
    } catch(err) {
        reject(err);
    }
});


module.exports.saveCode = (newCode, groupId) => new Promise(async (resolve, reject) => {
    try{
        let data = models.Group.update(
            {code: newCode},
            {where: {id: groupId}}
        );
        resolve(data);
    }catch(err) {
        reject(err);
    }
});