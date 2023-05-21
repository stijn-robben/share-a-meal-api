const database = require('../util/inmem-db');
const logger = require('../util/utils').logger;
const assert = require('assert');
const pool = require('../util/mysql-db');



const mealController = {
  //UC 301
  createMeal: (req, res, next) => {
    logger.info('UC-301');

    const meal = req.body;
    logger.debug('meal = ', meal);

    try {
        assert(meal.name != null, 'name is missing');
        assert(typeof meal.name === 'string', 'name must be a string');

        assert(meal.description != null, 'description is missing');
        assert(typeof meal.description === 'string', 'description must be a string');

        assert(meal.isActive != null, 'isActive is missing');
        assert(typeof meal.isActive === 'number', 'isActive must be a number');

        assert(meal.isVega != null, 'isVega is missing');
        assert(typeof meal.isVega === 'number', 'isVega must be a number');

        assert(meal.isVegan != null, 'isVegan is missing');
        assert(typeof meal.isVegan === 'number', 'isVegan must be a number');

        assert(meal.isToTakeHome != null, 'isToTakeHome is missing');
        assert(typeof meal.isToTakeHome === 'number', 'isToTakeHome must be a number');

        assert(meal.dateTime != null, 'dateTime is missing');
        assert(typeof meal.dateTime === 'string', 'dateTime must be a string');

        assert(meal.price != null, 'price is missing');
        assert(typeof meal.price === 'number', 'price must be a number');

        assert(meal.imageUrl != null, 'imageUrl is missing');
        assert(typeof meal.imageUrl === 'string', 'imageUrl must be a string');

        assert(meal.allergenes != null, 'allergenes are missing')
        assert(typeof meal.allergenes === 'string', 'allergenes must be an string')

        assert(meal.maxAmountOfParticipants != null, 'maxAmountOfParticipants is missing');
        assert(typeof meal.maxAmountOfParticipants === 'number', 'maxAmountOfParticipants must be a number');


    } catch (err) {
        console.error(err)
        next({
            status: 400,
            message: err.message,
            data: {}
        });
        return;
    }

    const query =
        'INSERT INTO meal (isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, name, description, allergenes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [meal.isActive, meal.isVega, meal.isVegan, meal.isToTakeHome, meal.dateTime, meal.maxAmountOfParticipants, meal.price, meal.imageUrl, meal.name, meal.description, meal.allergenes];

    pool.getConnection(function (err, conn) {
        if (err) {
            next({
                status: 500,
                message: 'Error connecting to database',
                data: {},
            });
            return;
        }
        if (conn) {
            conn.query(query, values, function (err, results) {
                if (err) {
                    next({
                        status: 500,
                        message: 'Error executing query: ' + err,
                        data: {},
                    });
                    return;
                }
    
                const insertedId = results.insertId;
                logger.info(`Meal met id ${insertedId} is toegevoegd`);
                res.status(200).json({
                    status: 200,
                    message: `Meal met id ${insertedId} is toegevoegd`,
                    data: { id: insertedId, ...meal },
                });
    
                pool.releaseConnection(conn);
            });
        }
    });
},

getAllMeals: (req, res, next) => {
    logger.info('UC-303');
    const id = req.query.id;
    const isActive = req.query.isActive;
    const isVega = req.query.isVega;
    const isToTakeHome = req.query.isToTakeHome;
    const dateTime = req.query.dateTime;
    const maxAmountOfParticipants = req.query.maxAmountOfParticipants;
    const price = req.query.price;
    const imageUrl = req.query.imageUrl;
    const cookId = req.query.cookId;
    const createDate = req.query.createDate;
    const updateDate = req.query.updateDate;
    const name = req.query.name;
    const description = req.query.description;
    const allergenes = req.query.allergenes;

    
    // WHERE 1 = 1 zorgt ervoor dat je dingen aan de query kunt plakken
    let query = 'SELECT * FROM meal WHERE 1 = 1';
    
    if (id !== undefined) {
        query += ` AND id = '${id}'`;
      }
      
      if (isActive !== undefined) {
        query += ` AND isActive = '${isActive}'`;
      }
      
      if (isVega !== undefined) {
        query += ` AND isVega = '${isVega}'`;
      }
      
      if (isToTakeHome !== undefined) {
        query += ` AND isToTakeHome = '${isToTakeHome}'`;
      }
      
      if (dateTime !== undefined) {
        query += ` AND dateTime = '${dateTime}'`;
      }
      
      if (maxAmountOfParticipants !== undefined) {
        query += ` AND maxAmountOfParticipants = '${maxAmountOfParticipants}'`;
      }
      
      if (price !== undefined) {
        query += ` AND price = '${price}'`;
      }
      
      if (imageUrl !== undefined) {
        query += ` AND imageUrl = '${imageUrl}'`;
      }
      
      if (cookId !== undefined) {
        query += ` AND cookId = '${cookId}'`;
      }
      
      if (createDate !== undefined) {
        query += ` AND createDate = '${createDate}'`;
      }
      
      if (updateDate !== undefined) {
        query += ` AND updateDate = '${updateDate}'`;
      }
      
      if (name !== undefined) {
        query += ` AND name = '${name}'`;
      }
      
      if (description !== undefined) {
        query += ` AND description = '${description}'`;
      }
      
      if (allergenes !== undefined) {
        query += ` AND allergenes = '${allergenes}'`;
      }
    
    

  
    pool.getConnection(function (err, conn) {
      if (err) {
        next({
          status: 500,
          message: 'Error connecting to database',
          data: {},
        });
      } else {
        conn.query(query, function (err, results, fields) {
          if (err) {
            next({
              status: 409,
              message: err.message,
              data: {},
            });
          } else {
            logger.info(`Found ${results.length} results`);
            res.status(200).json({
              status: 200,
              message: 'Meal getAll endpoint',
              data: results,
            });
          }
          conn.release();
        });
      }
    });
  },

  getMealWithID: (req, res, next) => {
    logger.info('UC-304');
    
    const mealId = parseInt(req.params.mealId);
    const query = 'SELECT * FROM meal WHERE id = ?';
    pool.getConnection(function (err, conn) {
        if (err) {
            next({
                status: 500,
                message: 'Error connecting to database',
                data: {}
            });
        }
        if (conn) {
            conn.query(query, [mealId], function (err, results) {
                if (err) {
                    next({
                        status: 500,
                        message: 'Error executing query ' + err,
                        data: {}
                    });
                    return;
                }
                if (results && results.length > 0) {
                    logger.info('Found meal with id', mealId);
                    const user = results[0];
                    res.status(200).json({
                        status: 200,
                        message: `Meal met id ${mealId} is gevonden`,
                        data: user,
                    });
                } else {
                    next({
                        status: 404,
                        message: `Meal met id ${mealId} kan niet gevonden worden...`,
                    });
                    return;
                }
            });
            pool.releaseConnection(conn);
        }
    });
  },

  //UC 305
  deleteMeal: (req, res, next) => {
    logger.info('UC-305');
    const userId = req.userId;
    const mealId = parseInt(req.params.mealId)
    console.info('mealId en userId: ' + mealId + ' ' + userId)
    const checkOwner = "SELECT userId FROM meal_participants_user WHERE mealId = '" + mealId + "' AND userId = '" + userId + "';"
    const deleteQuery = 'DELETE FROM meal WHERE id = ?';

    pool.getConnection(function (err, conn) {
        if (err) {
            next({
                status: 500,
                message: err,
                data: {}
            });
            return;
        }
        if (conn) {
            conn.query(checkOwner, function(err, results) {
                if (err) {
                    next({
                        status: 500,
                        message: 'Error executing query: ' + err,
                        data: {}
                    });
                    return;
                }
                if(results.length === 0){
                    next({
                        status: 401,
                        message: 'Not authorized',
                    });
                    return;
                } else {
                    conn.query(deleteQuery, [mealId], function (err, results) {
                        if (err) {
                            next({
                                status: 500,
                                message: 'Error executing query: ' + err,
                                data: {}
                            });
                            return;
                        }
                        logger.info(`Meal with id ${mealId} is deleted`);
                        res.status(200).json({
                            status: 200,
                            message: `User met id ${mealId} is verwijderd`,
                            data: {},
                        });
                    });
                }
            })
            
            pool.releaseConnection(conn);
        }
    });
},
};

module.exports = mealController;