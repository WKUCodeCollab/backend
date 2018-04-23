var express = require('express');
var router = express.Router();
var groupController = require('../../controllers/group');
var groupMemberController = require('../../controllers/groupmembers');
var models = require('../../models');
const passport = require('passport');


//create a group
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  groupController.createGroup(req.body.roomName, req.body.userId)
  .then((group) => {
    res.status(200).json({ success: true, groupId: group.id });
  }, (err) => {
    if (err) return res.status(500).send({ success: false, err });
  });
});

//get all groups
router.get('/',  passport.authenticate('jwt', { session: false }), async (req, res) =>{
  groupController.getAllGroups()
  .then((groups) => {
    res.status(200).json({ success: true, groups });
  }, (err) => {
    if (err) return res.status(500).send({ success: false, err });
  });
});

//get a single group by id
router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const members = await groupMemberController.getGroupMembers(+req.params.id);
    if (!members) { res.status(404).json({ success: false }); }
    if(members.contains(req.user.id)) {
      const data = await groupController.getGroupById(+req.params.id);
      if (!data) { res.status(404).json({ success: false }); }
      else { res.status(200).json({ success: true, data }); }
    } else {
      // change this to 404 in prod to avoid injection attempts
      res.status(401).json({ success: false });
    }
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
});

//get a user's groups
router.get('/user', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const groups = await groupMemberController.getUsersGroups(req.user.id);
    if(!groups) {
      // 204 means it went through but no content returned, meaning the user is in no groups
      res.status(204).json({ success: true, groups: null });
    } else {
      res.status(200).json({ success: true, groups });
    }
  } catch (err) {
    res.status(400).json({ success: false, err });
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