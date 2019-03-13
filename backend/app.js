const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const favicon = require('serve-favicon');
const logger = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('./middleware/cors');

const app = express();

// Logging
app.use(logger('dev'));

// Connect mongooose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch((err) => {
    console.log('MongoDB connection failure: ' + err);
  });


// Load Routes
const api = require('./routes/api/api');

// Cors Middleware
app.use(cors);

// Body Parser Middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json());


// Middleware passport
app.use(passport.initialize());
// app.use(passport.session()); Stores data in session -> cookies https://medium.com/front-end-weekly/learn-using-jwt-with-passport-authentication-9761539c4314
require('./config/passport')(passport);

// Use Routes
app.use('/api', api);

// Set static folder
app.use('/', express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

// Export App
module.exports = app;
