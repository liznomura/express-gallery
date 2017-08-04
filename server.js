/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();

// password hashing
const RedisStore = require('connect-redis')(session);
const saltRounds = 10;
const bcrypt = require('bcrypt');

let db = require('./models');
let Users = db.users;
let Authors = db.authors;
let Photos = db.photos;

const galleryRouter = require('./routes/gallery.js');
const loginRouter = require('./routes/login.js');
const registerRouter = require('./routes/register.js');

let PORT = process.env.PORT || 9000;


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
  store: new RedisStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done)=> {
  console.log('serializing');
  done(null, user.dataValues.id);
});

passport.deserializeUser((id, done)=> {
  console.log('deserializing');
  Users.findById(id)
  .then( user => { return done(null, user); } )
  .catch( err => { return done(err); } );
});

passport.use(new LocalStrategy((username, password, done) => {
  Users.findOne({ where: {username: username} })
  .then( user => {
    if (user === null) {
      return done(null, false, {message: 'bad username or password'});
    }
    else {
      bcrypt.compare(password, user.password)
      .then(res => {
          if (res) { return done(null, user); } //goes to serializer
          else {
            return done(null, false, {message: 'bad username or password'});
          }
        });
    }
  })
  .catch( err => { console.log('error: ', err); });
}));


app.use('/', galleryRouter);
app.use('/', loginRouter);
app.use('/', registerRouter);

app.listen(PORT, () => {
  // db.sequelize.drop();
  db.sequelize.sync();

  console.log(`Server running on ${PORT}`);
});