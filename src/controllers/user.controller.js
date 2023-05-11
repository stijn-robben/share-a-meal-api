const database = require('../util/inmem-db');
const logger = require('../util/utils').logger;
const assert = require('assert');
const pool = require('../util/mysql-db');



const userController = {
  //UC 201
  createUser: (req, res, next) => {
    logger.info('UC-201');

    const user = req.body;
    logger.debug('user = ', user);

    try {
        assert(user.firstName != null, 'firstName is missing');
        assert(typeof user.firstName === 'string', 'firstName must be a string');

        assert(user.lastName != null, 'lastName is missing');
        assert(typeof user.lastName === 'string', 'lastName must be a string');

        assert(user.emailAddress != null, 'emailAddress is missing');
        assert(typeof user.emailAddress === 'string', 'emailAddress must be a string');

        assert(user.password != null, 'password is missing');
        assert(typeof user.password === 'string', 'password must be a string');

        assert(user.phoneNumber != null, 'phoneNumber is missing');
        assert(typeof user.phoneNumber === 'string', 'phoneNumber must be a string');

        assert(user.isActive != null, 'isActive is missing');
        assert(typeof user.isActive === 'number', 'isActive must be a number');

        assert(user.city != null, 'city is missing');
        assert(typeof user.city === 'string', 'city must be a string');

        assert(user.street != null, 'street is missing');
        assert(typeof user.street === 'string', 'street must be a string');
    } catch (err) {
        next({
            status: 400,
            message: err.message,
            data: {}
        });
        return;
    }

    if (user.password.length < 5) {
      next({
          status: 400,
          message: 'Invalid password',
          data: {}
      });
      return;
  }

    const emailRegex = /\S+@\S+\.\S+/;
     if (!emailRegex.test(user.emailAddress)) {
         next({
             status: 400,
             message: 'Invalid emailAddress',
             data: {}
         });
         return;
    }

    const query =
        'INSERT INTO user (firstName, lastName, emailAdress, password, phoneNumber, isActive, city, street) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [user.firstName, user.lastName, user.emailAddress, user.password, user.phoneNumber, user.isActive, user.city, user.street];

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
                    if (err.code === 'ER_DUP_ENTRY') {
                        next({
                            status: 403,
                            message: 'Email address bestaat al',
                            data: {},
                        });
                        return;
                    } else {
                        next({
                            status: 500,
                            message: 'Error executing query: ' + err,
                            data: {},
                        });
                        return;
                    }
                }
                const insertedId = results.insertId;
                logger.info(`Gebruiker met id ${insertedId} is toegevoegd`);
                res.status(200).json({
                    status: 200,
                    message: `Gebruiker met id ${insertedId} is toegevoegd`,
                    data: { id: insertedId, ...user },
                });
            });
            pool.releaseConnection(conn);
        }
    });
},

  //UC 202
  getAllUsers: (req, res, next) => {
    logger.info('UC-202');
    const id = req.query.id;
    const firstName = req.query.firstName;
    const lastName = req.query.lastName;
    const emailAddress = req.query.emailAddress;
    const phoneNumber = req.query.phoneNumber;
    const roles = req.query.roles;
    const street = req.query.street;
    const city = req.query.city;
    const isActive = req.query.isActive;
    
    // WHERE 1 = 1 zorgt ervoor dat je dingen aan de query kunt plakken
    let query = 'SELECT * FROM user WHERE 1 = 1';
    
    if(id !== undefined){
      query+=  ` AND id = '${id}'`
    }
    if (firstName !== undefined) {
      query += ` AND firstName = '${firstName}'`;
    }
    if (lastName !== undefined) {
      query += ` AND lastName = '${lastName}'`;
    }
    if (emailAddress !== undefined) {
      query += ` AND emailAddress = '${emailAddress}'`;
    }
    if (phoneNumber !== undefined) {
      query += ` AND phoneNumber = '${phoneNumber}'`;
    }

    if (roles !== undefined) {
      const rolesArr = roles.split(',');
      const roleConditions = rolesArr.map(role => `roles LIKE '%${role}%'`).join(' OR ');
      query += ` AND (${roleConditions})`;
    }
    if (street !== undefined) {
      query += ` AND street = '${street}'`;
    }
    if (city !== undefined) {
      query += ` AND city = '${city}'`;
    }
    if (isActive !== undefined) {
      query += ` AND isActive = ${isActive}`;
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
              message: 'User getAll endpoint',
              data: results,
            });
          }
          conn.release();
        });
      }
    });
  },

  //UC 203
  getProfile: (req, res) => {
    logger.info('UC-203');
    //Hier moet code komen die ervoor zorgt dat de id word opgevraag van de user als hij is ingelogd.
    let query = 'SELECT * FROM user WHERE id =' + id
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
            res.status(200).json({
              status: 200,
              message: 'User met id ' + id + 'is gevonden!',
              data: results,
            });
          }
          conn.release();
        });
      }
    });
},

// UC 204
getUserWithID: (req, res, next) => {
  logger.info('UC-204');

  const userId = parseInt(req.params.userId);
  const userQuery = 'SELECT * FROM user WHERE id = ?';
  pool.getConnection(function (err, conn) {
      if (err) {
          next({
              status: 500,
              message: 'Error connecting to database',
              data: {}
          });
      }
      if (conn) {
          conn.query(userQuery, [userId], function (err, results) {
              if (err) {
                  next({
                      status: 500,
                      message: 'Error executing query',
                      data: {}
                  });
                  return;
              }
              if (results && results.length > 0) {
                  logger.info('Found user with id', userId);
                  const user = results[0];
                  res.status(200).json({
                      status: 200,
                      message: `Gebruiker met id ${userId} is gevonden`,
                      data: user,
                  });
              } else {
                  next({
                      status: 404,
                      message: `Gebruiker met id ${userId} kan niet gevonden worden...`,
                  });
                  return;
              }
          });
          pool.releaseConnection(conn);
      }
  });
},

  // UC 205
  updateUser: (req, res, next) => {
    logger.info('UC-205');

    const userId = parseInt(req.params.userId);
    logger.debug('userId = ', userId);

    const userUpdates = req.body;

    try {
        
        assert(userId != null, 'userId is missing');
        assert(typeof userId === 'number', 'userId must be a number');
    } catch (err) {
        next({
            status: 400,
            message: err.message,
        });
        return;
    }

    if (userUpdates.phoneNumber) {
      const phoneRegex = /^\+[1-9]\d{0,2}\d{1,14}$/ //volgens E.164
      if (!phoneRegex.test(userUpdates.phoneNumber)) {
           next({
           status: 400,
           message: 'Invalid phoneNumber',
          });
          return;
      }
  }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(userUpdates.emailAddress)) {
         next({
             status: 400,
             message: 'Invalid emailAddress',
         });
         return;
   }


    const userQuery = 'SELECT * FROM user WHERE id = ?';

    pool.getConnection((err, conn) => {
        if (err) {
            next({
                status: 500,
                message: err,
                data: {},
            });
            return;
        }
        if (conn) {
            conn.query(userQuery, [userId], (err, results) => {
                if (err) {
                    next({
                        status: 500,
                        message: 'Error executing query: ' + err,
                        data: {}
                    });
                    return;
                }
                if (results.length === 0) {
                    next({
                        status: 404,
                        message: `User met id ${userId} kan niet gevonden worden`,
                    });
                    return;
                }

                const user = results[0];

                let updatedUser = { ...user };

                for (const key in userUpdates) {
                    if (key in user) {
                        updatedUser[key] = userUpdates[key];
                    }
                }

                const updateQuery = 'UPDATE user SET ? WHERE id = ?';
                conn.query(updateQuery, [updatedUser, userId], (err, results) => {
                    if (err) {
                        next({
                            status: 500,
                            message: 'Error executing query: ' + err,
                        });
                        return;
                    }
                    logger.info(`User met id ${userId} is aangepast`);
                    res.status(200).json({
                        status: 200,
                        message: `User met id ${userId} is aangepast`,
                        data: updatedUser,
                    });
                });

                pool.releaseConnection(conn);
            });
        }
    });
},

  //UC 206
  deleteUser: (req, res, next) => {
    logger.info('UC-206');

    const userId = parseInt(req.params.userId);

    const deleteQuery = 'DELETE FROM user WHERE id = ?';

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
            conn.query(deleteQuery, [userId], function (err, results) {
                if (err) {
                    next({
                        status: 500,
                        message: 'Error executing query: ' + err,
                        data: {}
                    });
                    return;
                }
                if (results.affectedRows === 0) {
                    next({
                        status: 404,
                        message: 'User not found',
                        data: {}
                    });
                    return;
                }
                logger.info(`User with id ${userId} is deleted`);
                res.status(200).json({
                    status: 200,
                    message: `User met id ${userId} is verwijderd`,
                    data: {},
                });
            });
            pool.releaseConnection(conn);
        }
    });
},
};

module.exports = userController;