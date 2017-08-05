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
  findAllPhotos(req, res)
  .then(photos => {
    let photosObj = { photos: photos };
    res.render('./templates/index', photosObj);
  });
});

router.get('/login', (req, res)=> {
  res.render('./templates/login');
});

router.get('/success', (req, res)=> {
  res.render('./templates/success');
});

router.post('/login', passport.authenticate('local',{
  successRedirect: '/success',
  failureRedirect: '/login'
}));



router.get('/gallery/new', ( req, res ) => {
  res.render('./templates/new');
});


router.get('/success', Utilities.isAuthenticated, (req, res) =>{
  res.render('./templates/success', photosObj);
});


router.get('/gallery/:id', (req, res) => {
  findAllPhotos(req, res)
  .then( photos =>{
    let photoId = parseInt(req.params.id);
    let user = req.user;

    let mainPhoto = photos.filter( photo => { return photoId === photo.id; });
    let otherPhotos = photos.filter( photo => { return photoId !== photo.id; });
    let isOp = mainPhoto[0].user_id === user.id;

    let photoObj = {
      mainPhoto: mainPhoto,
      otherPhotos: otherPhotos,
      isOp: isOp
    };
    console.log(photoObj);
    res.render('./templates/photo', photoObj);
  })
  .catch( err =>{
    console.log(err);
  });
});

router.get('/gallery/:id/edit', Utilities.isAuthenticated, (req, res) =>{
  let user = req.user;
  let photoId = req.params.id;

  Photos.findById(photoId, { include: { model: Authors } })
  .then( photo => {
    let photoObj = {
      id: photo.id,
      title: photo.title,
      link: photo.link,
      description: photo.description,
      user_id: photo.user_id,
      author_id: photo.author_id,
      author: photo.author.author
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
      { author_id: author.id,
        user_id: req.user.id,
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

function findAllPhotos( req, res ) {
  return Photos.findAll({ include: { model: Authors } })
  .then( photosList => {

    let photos = [];

    photosList.forEach( photo => {
      return photos.push({
        id: photo.id,
        title: photo.title,
        link: photo.link,
        description: photo.description,
        user_id: photo.user_id,
        author_id: photo.author_id,
        author: photo.author.author });
    });

    return photos;
  });
}

function findOthers( req, res ) {
  return Photos.findAll({ where: { id: { $ne: req.params.id } } }, { include: { model: Authors } });
}
