'use strict';

const rx = require('rx');
const server = require('./server');

const routesStream = require('./routes');

const routing = server
    .combineLatest(
        routesStream,
        function (app, routes) {
            return { app, routes };
        }
    )
    .flatMapLatest(({ app, routes }) => {

    return rx.Observable.create(function (o) {
        
        routes.forEach(function ({ method, path, handler }) {

            app[method](path, function (req, res) {
                o.onNext({
                    req,
                    res,
                    handler
                });
            });
        });

    });

})
.publish();
    

routing.connect();

module.exports = routing;