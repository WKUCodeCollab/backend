var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var groupController = require('../controllers/group');
var models = require('../models');
var VerifyToken = require('./VerifyToken');

// POST login
router.post('/creategroup', function(req, res) {
    groupController.createGroup(req.body.userId)
    .then((group) => {
      if (!group) return res.status(500).send('Error creating group');

      res.status(200).send({ groupId: group.id });
    }, (err) => {
      if (err) return res.status(500).send('Error on the server.');
    });
});

module.exports = router;