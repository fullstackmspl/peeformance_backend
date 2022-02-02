const express = require('express');
const signupController = require('../handlers/signup/signupController');

const router = express.Router();

router.post('/signup', signupController.signup);

module.exports = router;
