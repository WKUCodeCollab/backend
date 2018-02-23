// modules
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');

// express app
const app = express();

const port = process.env.NODE_PORT || 3000;

// middleware
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// starter route
app.get('/', (req, res) => {
  res.end('i work!');
});

// TODO: add routes for api, user auth, etc.

// listen on port 3000
app.listen(port, () => {
  console.log('Server listening on port 3000...');
});
