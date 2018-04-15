const models = require('../models');

module.exports.createFriendRequest = (user1, user2) => new Promise(async (resolve, reject) => {
    try {        
        let data = await models.friendrequests.save({sentBy: user1, receivedBy: user2}); 
        resolve(data);
    } catch (err) {
        reject(err);
    }
});

