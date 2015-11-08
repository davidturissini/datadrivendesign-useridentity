'use strict';

require('node-babel')();


const serverPort = require('./server/port');
const serverStart = require('./server/server');
const serverResponse = require('./server/response');

serverStart.combineLatest(serverPort, function (app, port) {
    return ({ app: app, port: port });
}).subscribe((data) => {
    console.log(`App listening on port ${data.port}`);
});


serverStart.connect();
