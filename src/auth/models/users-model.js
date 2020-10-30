'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const users = new mongoose.Schema({
  username: { type: String,required: true },
  password: { type: String, required: true},
  role: { type: String, required: true, enum: ['user', 'admin', 'editor', 'user'] },
});

// Map of roles to capabilites, assigned to our token that we give the client
const capabilities = {
  admin: ['read', 'create', 'update', 'delete'],
  writer: ['read', 'create'],
  editor: ['read', 'update'],
  user: ['read'],
}

users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

users.save = async function () {
  const hashedPassword = await bcrypt.hash(this.assword, 10); // encrypt / salt
  
  console.log(hashedPassword);

};

users.statics.authenticateBasic = async function (username, password) {

  // username is grabbed and put into a query object
  let query = { username };
  // find one with THAT query
  return (
    this.findOne(query)
      // if it finds it, something happens, and if it doesn't the console.error happens (presumably)
      .then(user => {
    
        return user && user.comparePassword(password); 
      })
      .catch(console.error)
  );
};


users.methods.comparePassword = function (plainPassword, password) {
  console.log('PLAIN PASSWORD: ', plainPassword);
  console.log('PASSWORD: ', this.password);

  return (
    bcrypt
      // compares string variable with stored variable password
      .compare(plainPassword, this.password)
      .then(valid => (valid ? this : null))
  );
};

users.methods.generateToken = async function () {
  try {
    let token = await jwt.sign({
      username: this.username,
      capabilities: capabilities[this.role],
    }, 'SECRET_STRING');
    return token;
  } catch (e) {
    console.log(e);
    return Promise.reject('Token error');
  }
};

module.exports = mongoose.model('users', users);
