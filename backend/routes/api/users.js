const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = express.Router();

const User = require('../../models/user');

router.post('/register', (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser)
    // User created?
    .then(() => res.status(201).json({
      success: true,
      message: 'User registered'
    }))
    // Error while creating?
    .catch(err => res.status(500).json({
      success: false,
      message: 'Failed to register user'
    }));
});

router.post('/login', (req, res) => {
   const username = req.body.username;
  const password = req.body.password;
  let fetchedUser;
  User.getUserByUsername(username)
    .then(user => {
      // User exists?
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      fetchedUser = user;
      return user.comparePassword(password);
    })
    .then(isMatch => {
      // Password matches?
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Password does not match'
        });
      }
      // if user is found and password is right create a token
      var token = jwt.sign(fetchedUser.toJSON(), process.env.PRIVATE_TOKEN, {
        expiresIn: 604800
      });

      // return the information including token as JSON
      res.status(200).json({
        success: true,
        token: 'JWT ' + token,
        expiresIn: 604800,
        user: {
          id: fetchedUser._id,
          name: fetchedUser.name,
          username: fetchedUser.name,
          email: fetchedUser.email
        }
      });
    })
    .catch(err => {
      res.status(500).json({ // Other errors
        success: false,
        message: err
      });
    })
});

router.get('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  User.getUserById(req.params.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json({
      success: false,
      message: 'Failed to register user'
    }));
});

module.exports = router;
