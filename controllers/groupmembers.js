const models = require('../models');
const Promise = require('bluebird');

// module.exports.addGroupMember = (groupId, userId) => new Promise(async (resolve, reject) => {
//     try{
//         let member = await models.GroupMembers.build({
//             GroupId: groupId,
//             UserId: userId
//         });
//         let data = await member.save();
//         resolve(data);
//     } catch(err) {
//         reject(err);
//     }
// });

// module.exports.removeGroupMember = (groupId, userId) => new Promise(async (resolve, reject) => {
//     try{
//         const data = await models.GroupMembers.destroy({
//             where: {groupId: groupId, userid: userId},
//             limit: 1
//         })
//         resolve(data);
//     } catch(err) {
//         reject(err);
//     }
// });

// module.exports.getUsersGroups = (userId) => new Promise(async( resolve, reject) => {
//     try{
//         const data = await models.GroupMembers.findAll({where: {UserId: userId}});
//         resolve(data);
//     }catch(err) {
//         reject(err);
//     }
// });

// module.exports.getGroupMembers = (groupId) => new Promise(async( resolve, reject) => {
//     try{
//         const data = await modelds.GroupMembers.findAll({where: {GroupId: groupId}});
//         resolve (data);
//     }catch(err) {
//         reject(err);
//     }
// });