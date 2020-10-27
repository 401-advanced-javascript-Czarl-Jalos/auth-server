'use strict';

const express = require('express');
const base64 = require('base-64');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

const mongoose = require('mongoose');

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;



