const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// UC-201 Registreren als nieuwe user
router.post('', userController.createUser);

// UC-202 Opvragen van overzicht van users
router.get('', userController.getAllUsers);

// UC-203 Opvragen van een gebruikersprofiel
router.get('/profile', userController.getProfile);

// UC-204 Opvragen van usergegevens bij ID
router.get('/:userId', userController.getUserWithID);

// UC-205 Wijzigen van usergegevens
router.put('/:userId', userController.updateUser);

// UC-206 Verwijderen van user
router.delete('/:userId', userController.deleteUser);
module.exports = router;