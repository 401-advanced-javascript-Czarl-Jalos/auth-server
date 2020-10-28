'use strict';

const server = require('./src/server.js');
require('dotenv').config();


server.listen(3000, () => {
  console.log('Server is running on PORT 3000');
});