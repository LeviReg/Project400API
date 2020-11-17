/* eslint-disable no-console */
/* eslint-disable consistent-return */
// imports for required modules
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const config = require('../Config/Config');

function createToken(user) {
    return jwt.sign(
      {
        userID: user.id,
        email: user.email,
      },
      config.jwtSecret,
      {
        expiresIn: 60 * 24 * 7,
      }
    );
  }

// first checking if body has email and pass
// the check if the user exists or not
// the user will register with their info if not

exports.registerUser = async (req, res) => {
  try{
    const { email, password, username, firstName, lastName } = req.body;

    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        msg: 'You must set email and password',
      });
    }
    const existingUser = await User.findOne({ email });
    const existingUserName = await User.findOne({ username });
  
    if (existingUser)
      return res.status(400).json({
        msg: 'The user already exists',
      });
  
    if (existingUserName)
      return res.status(400).json({
        msg: 'This username is taken, please try another one',
      });
  
    const newUser = await User.create({
      email,
      password,
      username,
      firstName,
      lastName,
    });
  
    return res.status(201).json(newUser)
  }
    catch (error) {
      return res.status(400).json({ msg: 'Creating User Failed' });
  }
  };
  
  // login function is similar to register
  exports.loginUser = (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        msg: 'You must set email and password',
      });
    }
  
    User.findOne(
      {
        email: req.body.email,
      },
      (err, user) => {
        if (err) {
          return res.status(400).json({
            msg: err,
          });
        }
  
        if (!user) {
          return res.status(400).json({
            msg: 'The user does not exists',
          });
        }
        user.comparePassword(req.body.password, (e, isMatch) => {
          if (isMatch && !e) {
            return res.status(200).json({
              token: createToken(user),
            });
          }
          return res.status(400).json({
            msg: 'The email and password do not match',
          });
        });
      }
    );
};