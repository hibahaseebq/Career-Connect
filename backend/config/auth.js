const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Example user database
const users = [
  {
    id: 1,
    username: 'user1',
    email: 'user1@example.com',
    passwordHash: '$2b$10$YIQd6QV5TGiPhhvLNXFoh.PmjPjTb7zlgQgqXPAFmfF83fVZL7Xcy' // hashed password for 'password123'
  },
  {
    id: 2,
    username: 'user2',
    email: 'user2@example.com',
    passwordHash: '$2b$10$YIQd6QV5TGiPhhvLNXFoh.PmjPjTb7zlgQgqXPAFmfF83fVZL7Xcy' // hashed password for 'password123'
  }
];

// Configure passport to use local strategy for authentication
passport.use(new LocalStrategy(
  {
    usernameField: 'email', // assuming email is used for login
    passwordField: 'password'
  },
  function(email, password, done) {
    // Find user by email
    const user = users.find(user => user.email === email);
    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }
        
    // Compare password hashes
    bcrypt.compare(password, user.passwordHash, function(err, result) {
      if (err) {
        return done(err);
      }
      if (!result) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// Serialize user to store in the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(function(id, done) {
  const user = users.find(user => user.id === id);
  done(null, user);
});

module.exports = passport;
