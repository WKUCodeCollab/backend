const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const UserController = require('../controllers/user');
const config = require('./config');

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await UserController.getUserByEmail(email);
    if(!user) { return done(null, false); }
    await bcrypt.compare(password, user.password);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret,
}, async (payload, done) => {
  try {
    const user = await UserController.getUserById(payload.id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));
