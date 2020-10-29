'use strict';

const Users = require('../models/users-model');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) {
    next('Invalid Login: MISSING HEADERS!');
    return;
  }

  let token = req.headers.authorization.split(' ').pop();



  try {
    const validUser = await Users.authenticateToken(token);

    req.user = validUser;

    next();
  } catch (err) {
    next('INVALID LOGIN!');
  }
};
