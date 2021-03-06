'use strict';

const superagent = require('superagent');
const User = require('../models/users-model');

const tokenServerUrl = 'https://github.com/login/oauth/access_token';
const remoteAPI = 'https://api.github.com/user';
const API_SERVER = 'http://localhost:3000/oauth';

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Create a new middleware module called oauth.js in your auth module’s middleware folder

module.exports = async function authorize(req, res, next) {
  try {
    let code = req.query.code; // maybe take off await
    // console.log('MY REQUEST QUERY', req.query);
    console.log('(1) CODE: ', code);

    let remoteToken = await exchangeCodeForToken(code);
    console.log('(2) ACCESS TOKEN: ', remoteToken);

    let remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('(3) GITHUB USER: ', remoteUser);

    // Add the token and the user record to the request object
    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    console.log('(4) LOCAL USER: ', user);
    // If it is successful, use next() to continue on to the actual route handler
    next();
  } catch (error) {
    // If not, the middleware should invoke the error handler by calling next() with an error
    next(`ERROR: ${error.message}`);
  }
};

// Exchange the code received on the initial request for a token from the Provider
async function exchangeCodeForToken(code) {
  let tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization code',
  });

  let access_token = tokenResponse.body.access_token;

  return access_token;
}

// Use the token to retrieve the user’s account information from the Provider
async function getRemoteUserInfo(token) {
  let userResponse = await superagent
    .get(remoteAPI)
    .set('user-agent', 'express-app')
    .set('Authorization', `token ${token}`);

  let user = userResponse.body;

  return user;
}

// Create/Retrieve an account from our Mongo users database matching the user’s account (email or username) using the users model
// async function getUser(remoteUser) {
//   let user = await User.createFromOauth(remoteUser.login);
//   let token = user.generateToken();

//   return [user, token];
// }