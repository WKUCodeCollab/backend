const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || require('../config/config').secret;
const UserController = require('../controllers/user');
const models = require('../models');
const bcrypt = require('bcryptjs');

const router = express.Router();

// login
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  // This stuff is already being done with the authenticate middleware
  // The middleware adds the current user to the request object
  /* UserController.getUserByEmail(req.body.email)
  .then((user) => {
    if (!user) return res.status(404).send('No user found.');

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null }); */

    const token = jwt.sign({ id: req.user.id }, secret, {
      expiresIn: 86400
    });
    res.status(200).json({ success: true, token });
  /* }, (err) => {
    if (err) return res.status(500).send('Error on the server.');
  }); */
});

// logout
// TODO: FRONT END MUST DESTROY JWT UPON CALLING LOGOUT
router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({ success: true });
});

// register
router.post('/register', (req, res) => {
  let newUser = models.User.build({      // create a new instance of the User model
    firstName: req.body.firstName,  // set the user name... (comes from the request)
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  });

  UserController.addUser(newUser)
    .then(data => res.status(200).json({ success: true, data: data.id }))
    .catch(err => res.status(400).json({ success: false, err: err.toString() }));
});

// verify token
router.post('/verify', (req, res) => {
  let token = req.body.token;
  jwt.verify(token, secret, (err, payload) => {
    if(err || !payload) { 
      res.status(400).json({ success: false }); 
    } else { 
      res.status(200).json({ success: true, id: payload.id }); 
    }
  })
});

module.exports = router;
