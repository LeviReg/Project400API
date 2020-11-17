const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../Models/User');
const config = require('../Config/Config');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

// this middleware will run when a new request is recognised
module.exports = new JwtStrategy(opts, (jwtPayload, done) => {
  User.findById(jwtPayload.id, (err, u) => {
    if (err) {
      return done(err, false);
    }
    if (u) {
      return done(null, u);
    }

    return done(null, false);
  });
});