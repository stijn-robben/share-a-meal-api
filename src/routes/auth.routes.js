const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authentication.controller');

// UC-101 Inloggen toevoegen
router.get('',authenticationController.validateLogin ,authenticationController.login);

module.exports = router;