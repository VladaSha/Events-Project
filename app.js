let dotenv = require('dotenv').config()
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bcrypt = require('bcryptjs');
let axios = require('axios');
let hbs = require('hbs')


var app = express();

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const mongoose = require('mongoose');
//const User = require('./models/User');

// Connection to the database "eventsApp"
mongoose.connect('mongodb://localhost/eventsApp', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to Mongo!');
  }).catch(err => {
    console.error('Error connecting to mongo', err);
  });
mongoose.set('useFindAndModify', false);

//have to configure the middleware to enable sessions in Express
app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials')


//middleware that will execute before any route. 
//if the user logged in we store the username in locals
//in this spot the variable in locals will accessible anywhere
app.use(function (req, res, next) {
  if(req.session.currentUser) res.locals.username = req.session.currentUser.username
  next()
})

app.use('/', require('./routes/login'));
app.use('/', require('./routes/auth'));
app.use('/', require ('./routes/city'));
app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth-routes'));
app.use('/', require('./routes/profile'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
