
var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
var models = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST new user. */
router.post('/', function(req, res, next) {
  let newUser = models.User.build({      // create a new instance of the User model
    firstName: req.body.firstName,  // set the user name... (comes from the request)
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  });

  userController.addUser(newUser);
});

module.exports = router;
