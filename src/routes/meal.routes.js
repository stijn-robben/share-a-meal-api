const express = require('express');
const router = express.Router();
const mealController = require('../controllers/meal.controller');
const authenticationController = require('../controllers/authentication.controller');

// UC-301 Toevoegen van maaltijden
router.post('', authenticationController.validateToken, mealController.createMeal);

// UC-303 Opvragen van alle maaltijden
router.get('', mealController.getAllMeals);

// UC-304 Opvragen van maaltijden bij ID
router.get('/:mealId', mealController.getMealWithID);

// UC-305 Verwijderen van maaltijden
router.delete('/:mealId', authenticationController.validateToken, mealController.deleteMeal);

module.exports = router;