'use strict';

require('node-babel')();
const mongoose = require('mongoose');

const rx = require('rx');
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 4100;
const domainId = '564e940cd8cb7c747829f119';
const domainKey = '564aa7e623012238711bac64';

// Model
const Domain = require('./model/Domain');


// Stream
const domainFromRequestStream = require('./stream/domain/fromRequest');

// Action
const createDomainAction = require('./action/domain/create');

mongoose.connect('mongodb://localhost/test');

rx.Observable.create(function (o) {
        Domain.findOne({
            _id: domainId,
            key: domainKey
        }, function (err, domain) {
            if (err) {
                o.onError(err);
            }

            o.onNext(domain);
            o.onCompleted();
        });
    })

    .flatMapLatest((domain) => {

        if (domain) {
            return rx.Observable.return(domain);
        }

        return createDomainAction({
            _id: domainId,
            key: domainKey,
            name:'auth'
        });
    })
    .map((domain) => {
        const app = express();

        // parse application/json
        app.use(bodyParser.json());

        app.use(function(req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "x-domain-key, x-auth-token, Origin, X-Requested-With, Content-Type, Accept");
          next();
        });

        return app;

    })

    .flatMapLatest((app) => {

        const routes = [{
            method: 'post',
            path: '/users',
            handler: require('./controller/user/create')
        },{
            method: 'post',
            path: '/userSession',
            handler: require('./controller/userSession/create')
        },{
            method: 'get',
            path: '/domains/:domain_id/users/:user_id',
            handler: require('./controller/user/get')
        },{
            method: 'post',
            path: '/domains/:domain_id/userSession',
            handler: require('./controller/userSession/create')
        },{
            method: 'delete',
            path: '/domains/:domain_id/userSession',
            handler: require('./controller/userSession/delete')
        },{
            method: 'post',
            path: '/domains/:domain_id/users',
            handler: require('./controller/domain/createUser')
        }];

        return rx.Observable.create(function (o) {

            app.param('domain_id', function (req, res, next) {

                domainFromRequestStream(req)
                    .subscribe(function (domain) {
                        if (!domain) {
                            o.onNext({
                                res:res,
                                data: {
                                    error: {
                                        message: 'Invalid domain key'
                                    }
                                }
                            });
                        } else {
                            next();
                        }
                    });
                
            });

            routes.forEach(function (data) {

                app[data.method](data.path, function (req, res) {
                    data.handler(req)
                        .subscribe(function (data) {
                            o.onNext({
                                data: {
                                    data: data
                                },
                                res: res
                            });
                        }, function (error) {

                            o.onNext({
                                data: {
                                    error: {
                                        message: error
                                    }
                                },
                                res: res
                            });
                        })
                });

            
            });

            app.listen(port);
            console.log(`App listening on port ${port}`);

        });

    })
    .subscribe(function (data) {
        const res = data.res;
        const json = data.data;

        const jsonString = JSON.stringify(json);

        res.write(jsonString);
        res.end();
    }, function (err) {
        console.log(err);
    });