/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const Login = require('./login');
const Utilities = require('./utilities.js');

const router = express.Router();

let db = require('../models');
let Users = db.users;
let Authors = db.authors;
let Photos = db.photos;


router.get('/', (req, res) => {
  Photos.findAll({ include: { model: Authors } })
  .then( photos => {
    let photosObj = {
      photos: photos
    };
    res.render('./templates/index', photosObj);
  });
});


router.get('/gallery/new', ( req, res ) => {
  res.render('./templates/new');
});


router.get('/gallery/:id', (req, res) => {
  let photoId = req.params.id;
  Photos.findAll({ include: { model: Users } })
  .then( photos => {
    res.redirect('/');
  });
});

router.get('/gallery/:id/edit', (req, res) => {
  findPhoto(req, res)
  .then( photo => {
    res.render('./templates/edit', photo);
  });
});


router.post('/gallery', Utilities.isAuthenticated, (req, res) => {
  findAuthor(req, res)
  .then( author => {
    Photos.create(
      { author_id: author.id,
        link: req.body.link,
        description: req.body.description,
        user_id: req.user.id }
        );
  });
  res.redirect('/')
  .catch( err => {
    console.log(err);
  });
});

router.put('/gallery/:id', Utilities.isAuthenticated, (req, res) => {
  let photoId = req.params.id;
  findAuthor(req, res)
  .then( author => {
    Photos.update(
    {
      author_id: author.id,
      link: req.body.link,
      description: req.body.description
    },
    { where: { id: photoId } });
  });
  res.redirect(`/gallery/${req.params.id}`)
  .catch(err => {
    console.log(err);
  });
});

router.delete('/gallery/:id', Utilities.isAuthenticated, (req, res) => {
  let photoId = req.params.id;
  Photos.destroy({ where: {id: photoId} });
  res.redirect('/')
  .catch( err => {
    console.log(err);
  });

});

module.exports = router;

function findAuthor( req, res ) {
  return Authors.find({ where: { author: req.body.author } })
  .then( author => {
    if(author){
      return author;
    } else {
      return Authors.create(
        {author: req.body.author}
        );
    }
  });
}

function findPhoto( req, res ) {
  let photoId = req.params.id;
  return Photos.findOne({
    where: {id: photoId },
    include: [{model: Users}, {model: Authors}]
  });
}