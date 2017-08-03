/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const router = express.Router();

let db = require('../models');
let Users = db.users;
let Authors = db.authors;
let Photos = db.photos;

router.get('/create-user', (req, res) => {
  res.render('./templates/create-user');
});

router.post('/create-user', (req, res) => {
  Users.create(
    { username: req.body.username,
      password: req.body.password }
      )
  .then( user => {
    res.redirect('/login');
  })
  .catch( err => {
    console.log(err);
  });
});

module.exports = router;