'use strict';

const rx = require('rx');
const routingStream = require('./routing');


routingStream.subscribe(({ req, res, handler }) => {
    const h = require(handler);

    const handlerObservable = h(req);

    handlerObservable.subscribe(
        function (data) {
            res.write(data);
            res.end();
        }, 
        function (err) {
            const status = err.status || 500;
            const json = JSON.stringify({
                error: err.message
            });
            res.status(status).write(json);
            res.end();
        });

});