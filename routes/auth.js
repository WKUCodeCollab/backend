const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || require('../config/config').secret;
const UserController = require('../controllers/user');

const router = express.Router();

// login
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const token = jwt.sign(req.user.id, secret, {
    expiresIn: 60 * 60 * 24
  });
  res.status(200).json({ success: true, token: 'JWT ' + token });
});

// logout
// TODO: FRONT END MUST DESTROY JWT UPON CALLING LOGOUT
router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({ success: true });
});

// register
router.post('/register', (req, res) => {
  UserController.addUser(req.body)
    .then(data => res.status(200).json({ success: true, data: data.id }))
    .catch(err => res.status(400).json({ success: false, err: err.toString() }));
});

// verify token
router.post('/verify', (req, res) => {
  let token = req.body.token;
  jwt.verify(token.replace(/^JWT (.*)$/, '$1'), secret, (err, payload) => {
    if(err || !payload) { 
      res.status(400).json({ success: false }); 
    } else { 
      res.status(200).json({ success: true }); 
    }
  })
});

module.exports = router;
