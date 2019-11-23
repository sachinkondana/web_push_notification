require('dotenv').config();
const express = require('express');
const app = express();
const config = require('config');

require('./middleware/cors')(app);
require('./startup/routes')(app);

app.listen(config.get('port'), () => {
  console.log(`Listening to port ${config.get('port')}...`);
})
