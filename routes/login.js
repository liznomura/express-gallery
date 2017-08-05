/* jshint esversion:6 */
const express = require('express');
const passport = require('passport');
const Utilities = require('./utilities');

const router = express.Router();

let db = require('../models');
let Users = db.users;
let Authors = db.authors;
let Photos = db.photos;

router.get('/login', (req, res) => {
  res.render('./templates/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/success',
  failureRedirect: '/login'
}));

router.get('/success', Utilities.isAuthenticated, (req, res) => {
  res.render('./templates/success-login', { username: req.user.username });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
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