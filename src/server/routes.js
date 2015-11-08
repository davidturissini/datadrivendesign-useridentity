'use strict';

const fs = require('fs');
const rx = require('rx');

const readFileStream = rx.Observable.fromNodeCallback(fs.readFile)


const stream = readFileStream('./src/routes.json')
    .map((buffer) => {
        return JSON.parse(buffer.toString());
    });


module.exports = stream;