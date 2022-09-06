require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { wakeDyno } = require('heroku-keep-awake');

const { PORT: port } = process.env;
const app = express();
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(routes);


const DYNO_URL = 'https://webauditor.herokuapp.com';
app.listen(port, () => {
  
  const opts = {
    interval: 29,
    logging: false,
    stopTimes: { start: '00:00', end: '06:00' }
}

wakeDyno(DYNO_URL, opts);
  
console.log('Server started...')
});

module.exports = app;
