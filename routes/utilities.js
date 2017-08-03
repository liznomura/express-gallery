/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

let db = require('../models');
let Users = db.users;
let Authors = db.authors;
let Photos = db.photos;


function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

module.exports = {
  isAuthenticated: isAuthenticated
};