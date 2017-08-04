/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const router = express.Router();

// password hashing
const RedisStore = require('connect-redis')(session);
const saltRounds = 10;
const bcrypt = require('bcrypt');

let db = require('../models');
let Users = db.users;
let Authors = db.authors;
let Photos = db.photos;

router.get('/register', (req, res) => {
  res.render('./templates/register');
});

router.post('/register', (req, res) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      db.users.create({
        username: req.body.username,
        password: hash
      })
      .then( user => {
        res.redirect('/login');
      })
      .catch( err => { return res.send('Stupid username'); });
    });
  });
});

module.exports = router;