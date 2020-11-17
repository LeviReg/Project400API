const express = require('express');
const routes = express.Router();
const passport = require('passport');
const userController = require('./Controllers/User-controller');
const authToken = require('./Middleware/authtoken');
const User = require('./Models/User');

routes.use(express.json());
routes.get(
  '/',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    return res.send('Hello this is the API');
  }
);

routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);

// this route requires authentication
routes.get(
    '/home',
    passport.authenticate('jwt', {
      session: false,
    }),
    (req, res) => {
      return res.json({
        msg: `Hey ${req.user.username}! Welcome to the home screen!`,
      });
    }
  );

  module.exports = routes;