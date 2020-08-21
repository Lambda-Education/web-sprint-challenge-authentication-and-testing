const router = require('express').Router();
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const constants = require('../utils/constants');
const Users = require('./auth-model');

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  const hash = bcrpyt.hashSync(password);

  Users.add({ username, password: hash })
    .then((user) => {
      res.status(201).json({ message: `user created: ${user}` });
    })
    .catch((error) => {
      res.status(500).json({ message: `unable to create user` });
    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username: username }).then(([user]) => {
    if (user && bcrpyt.compareSync(password, user.password)) {
      const token = signToken(user);

      res.status(200).json({
        message: `Welcome to Dad Jokes, ${user.username}!`,
        token,
      });
    } else {
      res
        .status(401)
        .json({ message: `Invalid username or password` });
    }
  });
});

function signToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: '10d',
  };

  return jwt.sign(payload, constants.jwtSecret, options);
}

module.exports = router;
