'use strict';

const base64 = require('base-64');
const users = require('../models/users-model');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) {
    next('Invalid Login!!!');
    return;
  };

  let encodedPair = req.headers.authorization.split(' ').pop();

  const decoded = base64.decode(encodedPair);
  let [username, password] = decoded.split(':');
  console.log('USERNAME + PASSWORD: ', username, password);




