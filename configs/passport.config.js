const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FBStrategy = require('passport-facebook').Strategy;
const passport = require('passport');

passport.serializeUser((user, next) => {
  next(null, user._id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then(user => {
      next(null, user);
    })
    .catch(error => next(error));
});

passport.use('local-auth', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, next) => {
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        return user.checkPassword(password)
          .then(match => {
            if (match) {
              next(null, user);
            } else {
              next(null, null, { password: 'Invalid email or password' })
            }
          });
      } else {
        next(null, null, { password: 'Invalid email or password' })
      }
    })
    .catch(error => next(error));
}));

passport.use('google-auth', new GoogleStrategy({
  clientID: process.env.GOOGLE_AUTH_CLIENT_ID || 'todo',
  clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET || 'todo',
  callbackURL: process.env.GOOGLE_AUTH_CB || '/sessions/google/cb',
}, authenticateOAuthUser));

passport.use('facebook-auth', new FBStrategy({
  clientID: process.env.FB_AUTH_CLIENT_ID || 'todo',
  clientSecret: process.env.FB_AUTH_CLIENT_SECRET || 'todo',
  callbackURL: process.env.FB_AUTH_CB || '/sessions/facebook/cb',
  profileFields: ['displayName', 'emails']
}, authenticateOAuthUser));

function authenticateOAuthUser(accessToken, refreshToken, profile, next) {
  // Should find de user by profile.provider.
  // if it exists, call next
  // if it doesn't, create it with profile data
}