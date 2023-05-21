//
// Authentication controller
//
const assert = require('assert');
const jwt = require('jsonwebtoken');
const pool = require('../util/mysql-db');
const { logger, jwtSecretKey } = require('../util/utils');

module.exports = {
  /**
   * login
   * Retourneer een geldig token indien succesvol
   */
  login(req, res, next) {
    pool.getConnection((err, connection) => {
      if (err) {
        logger.error('Error getting connection from pool');
        next({
          code: 500,
          message: err.code
        });
      }
      if (connection) {
        /**
         * ToDo:
         * 1. SQL Select, zie of deze user id in de database bestaat.
         *    - Niet gevonden, dan melding Not Authorized
         * 2. Als user gevonden, check dan het password
         *    - Geen match, dan melding Not Authorized
         * 3. Maak de payload en stop de userId daar in
         * 4. Genereer het token en stuur deze terug in de response
         */

        const query = 'SELECT id FROM user WHERE emailAdress = ' + connection.escape(req.body.emailAddress) + ';';
        const validateQuery = 'SELECT password FROM user WHERE emailAdress = ' + connection.escape(req.body.emailAddress) + ';';

        connection.query(query, function(error, results) {
          if (error) {
            console.error(error);
            return next({
              status: 500,
              message: 'Error ' + error,
              data: {}
            });
          }
  
          if (results.length === 0) {
            // User not found
            logger.info('User not found')
            return next({
                status: 401,
              message: 'Not Authorized',
              data: {}
            });
          }
  
          // User found, continue with password check and token generation
          connection.query(validateQuery, function(error, passwordResults) {
            if (error) {

              console.error(error);
              return next({
                status: 500,
                message: 'Error ' + error,
                data: {}
              });
            }
  
            if (passwordResults.length === 0) {
              // Password not found
              logger.info('Password not found')
              return next({
                status: 401,
                message: 'Not Authorized',
                data: {}
              });
            }
  
            const userPassword = passwordResults[0].password;
            const enteredPassword = req.body.password;
            if (enteredPassword !== userPassword) {
                logger.info('Passwords dont match')
              return next({
                status: 401,
                message: 'Not Authorized',
                data: {}
              });
            }
  
            // Password is correct, continue with payload and token generation
            const payload = {
              userId: results[0].id
            };
  
            // Generate the token
            const token = jwt.sign(payload, jwtSecretKey);
  
            // Return the token in the response
            res.status(200).json({
              token: token
            });
  
            // Release the connection when finished using it
            connection.release();
          });
        });
      }
    });
  },
  

  /**
   * Validatie functie voor /api/login,
   * valideert of de vereiste body aanwezig is.
   */
  validateLogin(req, res, next) {
    // Verify that we receive the expected input
    try {
      assert(
        typeof req.body.emailAddress === 'string',
        'emailAdress must be a string.'
      );
      assert(
        typeof req.body.password === 'string',
        'password must be a string.'
      );
      next();
    } catch (ex) {
      res.status(422).json({
        error: ex.toString(),
        datetime: new Date().toISOString()
      });
    }
  },


  validateToken(req, res, next) {
    logger.trace('validateToken called');
    logger.trace(req.headers);
    
    // The headers should contain the authorization-field with value 'Bearer [token]'
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next({
        status: 401,
        message: 'Authorization header missing!',
        data: undefined
      });
    } else {
      // Extract the token from the authorization header
      const token = authHeader.split(' ')[1]; // Assuming the format is 'Bearer [token]'
    
      try {
        // Verify and decode the token
        const decoded = jwt.verify(token, jwtSecretKey);
    
        // Extract the userId from the payload
        const userId = decoded.userId;
    
        // Add the userId to the request object
        req.userId = userId;
    
        // Continue to the next endpoint
        next();
      } catch (err) {
        next({
          status: 401,
          message: 'Invalid token',
          data: undefined
        });
      }
    }
  }
  
};