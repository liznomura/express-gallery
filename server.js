/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const app = express();
const methodOverride = require('method-override');
const galleryRouter = require('./routes/gallery.js');

let PORT = process.env.PORT || 9000;

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use('/', galleryRouter);

let db = require('./models');
let Users = db.users;
let Photos = db.photos;

app.listen(PORT, () => {
    /*db.sequelize.drop();*/
  db.sequelize.sync();

  console.log(`Server running on ${PORT}`);
});