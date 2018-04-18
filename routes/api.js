const express = require('express');

const router = express.Router();

router.use('/user', require('./api/users'));
router.use('/group', require('./api/group'));

module.exports = router;