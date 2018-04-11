const models = require('../models');
const Promise = require('bluebird');
const bcrypt = require('bcryptjs');

module.exports.getAllUsers = () => new Promise(async (resolve, reject) => {
    try {
        const data = await models.User.findAll();
        resolve(data);
    } catch (err) {
        reject(err);
    }
});

module.exports.getUserById = id => new Promise(async (resolve, reject) => {
    try {
        const data = await models.User.findById(id);
        resolve(data);
    } catch (err) {
        reject(err);
    }
});

module.exports.getUserByEmail = email => new Promise(async (resolve, reject) => {
    try {
        const data = await models.User.findOne({
            where: { email: email }
        });
        resolve(data);
    } catch (err) {
        reject(err);
    }
});

module.exports.addUser = user => new Promise(async (resolve, reject) => {
    try {
        let salt = await bcrypt.genSalt();
        let hash = await bcrypt.hash(user.password, salt);
        user.setDataValue('password', hash);
        let data = await user.save();
        resolve(data);
    } catch (err) {
        reject(err);
    }
});

module.exports.updateUser = (user, id) => new Promise(async (resolve, reject) => {
    try {
        if(user.password) {
            let salt = await bcrypt.genSalt();
            let hash = await bcrypt.hash(user.password, salt);
            user.password = hash;
        }
        let data = await models.User.update(user, {
            where: { id: id }
        });
        resolve(data);
    } catch (err) {
        reject(err);
    }
});

module.exports.deleteUser = id => new Promise(async (resolve, reject) => {
    try {
        const data = await models.User.destroy({
            where: { id: id },
            limit: 1
        });
        resolve(data);
    } catch (err) {
        reject(err);
    }
});
