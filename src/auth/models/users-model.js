'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');

const users = new mongoose.Schema({
  username: { type: String,required: true },
  password: { type: String, required: true}
})


users.save = async function () {
  const hashedPassword = await bcrypt.hash(this.assword, 10); // encrypt / salt
  
  console.log(hashedPassword);

}

users.generateToken = async function () {

const token = jwt.sign({username: users.username }, 'SECRET_STRING');
return token;
}


module.exports = mongoose.model('users', users);
