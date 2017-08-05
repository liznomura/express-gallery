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
  Photos.findById(photoId, { include: [Authors] })
  .then( photo => {
    let photoObj = {
      photo: photo
    };
    res.render('./templates/photo', photoObj);
  });
});


router.get('/gallery/:id/edit', (req, res) => {
  findPhoto(req, res)
  .then( photo => {
    let photoObj = {
      photo: photo
    };

    res.render('./templates/edit', photoObj);
  });
});


router.post('/gallery', Utilities.isAuthenticated, (req, res) => {
  findAuthor(req, res)
  .then( author => {
    Photos.create(
      { title: req.body.title,
        author_id: author.id,
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
    console.log(author);
    if(author){
      return author;
    } else {
      return Authors.create(
        {author: req.body.author}
        );
    }
  });
}

function findPhoto(req, res) {
  let photoId = req.params.id;
  return Photos.findOne({ where: { id: req.params.id }}, { include: { model: Authors } });
}

function findOthers( req, res ) {
  console.log(req.params.id);
  return Photos.findAll({ where: { id: { $ne: req.params.id } } }, { include: { model: Authors } });
}