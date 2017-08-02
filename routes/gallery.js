/* jshint esversion:6 */
const express = require('express');
const router = express.Router();

let db = require('../models');
let Users = db.users;
let Photos = db.photos;

function findAuthor( req, res ) {
  return Users.find({ where: { author: req.body.author } })
  .then( author => {
    if(author){
      return author;
    } else {
      return Users.create(
        {author: req.body.author}
        );
    }
  });
}

function findPhoto( req, res ) {
  let photoId = req.params.id;
  return Photos.findOne({
      where: {id: photoId },
      include: {model: Users}
    });
}

router.post('/gallery', (req, res) => {
  findAuthor(req, res)
  .then( author => {
    Photos.create(
      { author_id: author.id,
        link: req.body.link,
        description: req.body.description }
        );
  });
  res.redirect('/')
  .catch( err => {
    console.log(err);
  });
});

router.get('/gallery/new', ( req, res ) => {
  res.render('./templates/new');
});

router.get('/gallery/:id', (req, res) => {
  findPhoto(req, res)
  .then( photo =>  {
    res.json(photo);
  });
});

router.get('/gallery/:id/edit', (req, res) =>{
  findPhoto(req, res)
  .then( photo =>  {
    console.log(photo);
    let photoObj = {
      author_id: photo.author_id,
      link: photo.link
    };
    console.log(photoObj);
    res.render('./templates/edit', photo);
  });
});

router.get('', (req, res) =>{
  Photos.findAll({ include: { model: Users } })
  .then( photos => {
    let photosObj = {
      photos: photos
    };
    res.render('./templates/index', photosObj);
  });
});

router.put('/gallery/:id', (req, res) => {
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

router.delete('/gallery/:id', (req, res) => {
  let photoId = req.params.id;
  Photos.destroy({ where: {id: photoId} });
  res.redirect('/')
  .catch( err => {
    console.log(err);
  });

});

module.exports = router;