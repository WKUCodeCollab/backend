
var express = require('express');
var router = express.Router();
/* This stuff comes up in the app.js - shouldn't need it here
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json()); */
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var userController = require('../controllers/user');
var models = require('../models');
var config = require('../config/config');
var VerifyToken = require('./VerifyToken');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET user info minus password
router.get('/me', VerifyToken, function(req, res, next) {      
  userController.getUserById(req.userId)
  .then((user) => {
    if (!user) return res.status(404).send("No user found.");
    delete user.password;
    res.status(200).send(user);
  }, (err) => {
    if (err) return res.status(500).send("There was a problem finding the user.");
  });
});

// middleware function
router.use(function (user, req, res, next) {
  res.status(200).send(user);
});

/* POST new user. */
router.post('/register', function(req, res, next) {
  let newUser = models.User.build({      // create a new instance of the User model
    firstName: req.body.firstName,  // set the user name... (comes from the request)
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  });

  userController.addUser(newUser)
  .then((user) => {
      // create a token
      console.log(user.id);
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });

      res.status(200).send({ auth: true, token: token });
  }, (err) => {
    if (err) return res.status(500).send("There was a problem registering the user.");
  });
});


// POST login
router.post('/login', function(req, res) {
  userController.getUserByEmail(req.body.email)
  .then((user) => {
    if (!user) return res.status(404).send('No user found.');

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token, expiresIn: 86400 });
  }, (err) => {
    if (err) return res.status(500).send('Error on the server.');
  });
});

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, config.secret);
  res.status(200).json({ success: true, token: 'JWT ' + token });
});

module.exports = router;
