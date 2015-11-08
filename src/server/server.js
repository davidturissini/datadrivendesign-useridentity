'use strict';

const rx = require('rx');
const express = require('express');
const serverPort = require('./port');
const bodyParser = require('body-parser');


const serverStart = serverPort.map((port) => {
    const app = express();

    // parse application/json
    app.use(bodyParser.json());

    app.listen(port);

    return app;

}).replay(undefined, 1);

module.exports = serverStart;