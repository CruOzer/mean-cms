var express = require('express');
var router = express.Router();


// Load Routes
const users = require('./users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Express RESTful API');
});


router.use('/users', users);


module.exports = router;
