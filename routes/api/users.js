var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var userController = require('../../controllers/user');
var models = require('../../models');
var config = require('../../config/config');
const passport = require('passport');

// the authenticate middleware checks for the current user stored in the jwt
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  delete req.user.password;
  res.status(200).json({ success: true, profile: req.user});
});

// delete user
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const data = await UserController.deleteUser(req.user.id);
    // TODO: MAKE TOKEN EXPIRE (MAYBE FRONT-END THING)
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: true, err });
  }
});

// update user
router.put('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const data = await UserController.updateUser(req.body.user, req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: true, err });
  }
});

module.exports = router;
