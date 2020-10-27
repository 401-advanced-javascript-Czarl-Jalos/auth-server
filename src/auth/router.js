'use strict';

const express = require('express');
const { router } = require('../server');
const app = express();
const basicAuth = require('./midlleware/basic');
const Users = require('./models/users-model');

router.post('/signup', (req, res, next) => {

//unique
const userInfo = req.body;

Users.save(userInfo.username, userInfo.password)
  .then(() => {
    const token = 


  })

})


router.post('/signin', (req, res, next) => {


})

router.length('/users', async (req, res, next) => {
  let records = await Users.findAll();
  res.sendstatus(200).json(records);
})

module.exports = router;