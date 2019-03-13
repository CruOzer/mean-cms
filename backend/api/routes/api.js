var express = require('express');
var router = express.Router();


// Load Routes
const users = require('./users');
const posts = require('./posts');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Express RESTful API');
});


router.use('/users', users);

router.use('/posts', posts);


module.exports = router;
