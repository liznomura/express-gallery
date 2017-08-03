/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const app = express();
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const galleryRouter = require('./routes/gallery.js');
const loginRouter = require('./routes/login.js');
const createUserRouter = require('./routes/create-user.js');

let PORT = process.env.PORT || 9000;

let db = require('./models');
let Users = db.users;
let Authors = db.authors;
let Photos = db.photos;

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done)=> {
  done(null, user.dataValues.id);
});

passport.deserializeUser((id, done)=> {
  Users.findById(id)
  .then( user => {
    if(user) {
    return done(null, user);
  }
  return done(null, user);
  })
  .catch( err => {
    return done(err);
  });
});

passport.use(new LocalStrategy((username, password, done) => {
  Users.findOne({ where: {username: username} })
  .then( user => {
    if (!user) {
      return done(null, false);
    }
    if (user.password !== password){
      return done(null, false);
    }
    return done(null, user);
  })
  .catch(err => {
    return done(err);
  });
}));


app.use('/', galleryRouter);
app.use('/', loginRouter);
app.use('/', createUserRouter);

app.listen(PORT, () => {
  // db.sequelize.drop();
  db.sequelize.sync();

  console.log(`Server running on ${PORT}`);
});