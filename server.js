const config = require('./config/config.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

const corsOptions = {
    exposedHeaders: 'Authorization',
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

require('./routes/index')(app);

app.listen(config.PORT, config.HOST, function () {
  console.log(`App listening on http://${config.HOST}:${config.PORT} | Enviroment: ${config.NODE_ENV}`);
});

module.exports = app;
