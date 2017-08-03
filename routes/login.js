/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const Utilities = require('./utilities');

const router = express.Router();

let db = require('../models');
let Users = db.users;
let Authors = db.authors;
let Photos = db.photos;

router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());


passport.serializeUser((user, cb)=> {
  cb(null, user.id);
});

passport.deserializeUser((id, cb)=> {
  Users.findById(id)
  .then( user => {
    return cb(null, user);
})
  .catch( err => {
    console.log(err);
  });
});

passport.use(new LocalStrategy((username, password, done) => {
  Users.findOne({ where: {username: username} })
  .then( user => {
    return done(null, user);
})
  .catch( err => {
    if(err) {return done(err);}
    if(!user){
      return done(null, false, {message: 'username does not exist'});
    }
    if(user.password !== password){
      return done(null, false, {message: 'incorrect password'});
    }
  });
}));

router.get('/login', (req, res) => {
  res.render('./templates/login');
});

router.post('/login', passport.authenticate('local', ({
  successRedirect: '/success',
  failureRedirect: '/login'
})));

router.get('/success', Utilities.isAuthenticated, (req, res) => {
  res.render('./templates/success-login', { username: req.user.username });
});

module.exports = router;

// function hasAdminAccess(req, res, next){
//   if(req.isAuthenticated()){
//     if(req.user.role === 'admin'){
//       return next();
//     }
//     return res.redirect('/secret');
//   }
//   res.redirect('/login.html');
// }