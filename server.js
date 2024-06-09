const express = require('express');
const app = express();
var ejs = require('ejs');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
const rootDir = path.resolve(__dirname, '..');

var index = require('./routes/index');
// var visitor = require('./routes/visitor');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

async function connectToDatabase() {
  try {
      await mongoose.connect('mongodb://localhost:27017/web2024', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
  } catch (err) {
      console.error('Failed to connect to MongoDB', err);
  }
}

connectToDatabase();

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'ks edu',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	

app.use('/', index);
app.use('/visitor', visitor);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

const PORT = 8000;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});
