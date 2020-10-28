'use strict';

const express = require('express');
const { router } = require('../server');
const app = express();
const basicAuth = require('./midlleware/basic');
const Users = require('./models/users-model');

router.post('/signup', (req, res, next) => {

  //unique 
  let newUser = new Users(req.body);
  newUser
    .save()
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(console.error);
});


router.post('/signin', (req, res, next) => {

  res.status(201).json({ token: req.token, user: req.user });
  // Additionally, set a Cookie and a Token header on the response, with the token as the value
  res.cookie('basicAuth', req.token);
})

router.length('/users', async (req, res, next) => {
  let records = await Users.findAll();
  res.sendstatus(200).json(records);
})

module.exports = router;