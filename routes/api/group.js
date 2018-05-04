const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/group');
const groupMemberController = require('../../controllers/groupmembers');
const models = require('../../models');
const passport = require('passport');

//create a group
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const data = await groupController.createGroup(req.body.roomName, req.user.id);
    if(!data) res.status(404).json({ success: false, data });
    else res.status(200).json({ success: true, groupID: data.id });
  } catch (err) {
    res.status(500).json({ success: false, err: err.message });
  }
});

//get all groups
router.get('/',  passport.authenticate('jwt', { session: false }), async (req, res) =>{
  try {
    const groups = await groupController.getAllGroups();
    if(!groups) res.status(404).json({ success: false, groups });
    else res.status(200).json({ success: true, groups });
  } catch (err) {
    res.status(500).json({ success: false, err: err.message });
  }
});

//get a single group by id
router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const data = await groupController.getGroupById(+req.params.id);
    if(!data || (Object.keys(data).length === 0 && data.constructor === Object)) {
      res.status(404).json({ success: false, data });
    } else {
      res.status(200).json({ success: true, data });
    }
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
});

// remove a group
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const group = await groupController.getGroupById(req.body.id);
    if(group.creator === req.user.id) {
      const data = await groupController.deleteGroup(group.id);
      res.status(200).json({ success: true, data });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
});

// add user to a group
router.post('/:groupId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const group = await groupController.getGroupById(+req.params.groupId);
    if (group.creator === req.user.id) {
      const data = await groupMemberController.addGroupMember(+req.params.groupId, req.body.id);
      res.status(200).json({ success: true, data });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
});

// remove user from a group
router.delete('/:groupId', passport.authenticate('jwt', { session: false }), async (req, res) => { 
  try {
    const group = await groupController.getGroupById(+req.params.groupId);
    if (group.creator === req.user.id && req.user.id !== req.body.id) {
      const data = await groupMemberController.removeGroupMember(+req.params.groupId, req.body.id);
      res.status(200).json({ success: true, data });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
});

module.exports = router;