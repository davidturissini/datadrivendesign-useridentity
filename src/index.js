'use strict';

require('node-babel')();
const mongoose = require('mongoose');

const rx = require('rx');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 4100;
const appId = '564e940cd8cb7c747829f119';
const appKey = '564aa7e623012238711bac64'
const crypto = require('crypto');

// Model
const App = require('./model/App');

// Stream
const appFromRequestStream = require('./stream/app/fromRequest');

// Action
const createAppAction = require('./action/app/create');

mongoose.connect('mongodb://localhost/test');

rx.Observable.create(function (o) {
        App.findOne({
            _id: appId,
            key: appKey
        }, function (err, app) {
            if (err) {
                o.onError(err);
            }

            o.onNext(app);
            o.onCompleted();
        });
    })

    .flatMapLatest((app) => {

        if (app) {
            return rx.Observable.return(app);
        }

        return createAppAction({
            _id: appId,
            key: appKey,
            name:'auth'
        });
    })
    .map((app) => {
        const expressApp = express();

        expressApp.use(function (req, res, next) {
            const headers = req.headers;
            const contentType = headers['Content-Type'];

            if (!contentType) {
                headers['Content-Type'] = 'application/json';
            }

            next();

        });

        // parse application/json
        expressApp.use(bodyParser.json());

        expressApp.use(function(req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "x-user-session-id, x-domain-key, x-auth-token, Origin, X-Requested-With, Content-Type, Accept");
          next();
        });

        expressApp.use(cors());

        return expressApp;

    })

    .flatMapLatest((expressApp) => {

        const routes = [{
            method: 'post',
            path: '/admins',
            handler: require('./controller/admin/create')
        },{
            method: 'post',
            path: '/apps/:app_id/userSession',
            handler: require('./controller/userSession/create')
        },{
            method: 'post',
            path: '/apps/:app_id/users',
            handler: require('./controller/app/createUser')
        },{
            method: 'get',
            path: '/apps/:app_id/users/:user_id',
            handler: require('./controller/user/get')
        },{
            method: 'post',
            path: '/apps/:app_id/users/:user_id/validateUserSession',
            handler: require('./controller/user/validateUserSession')
        },{
            method: 'delete',
            path: '/apps/:app_id/users/:user_id/destroyUserSession',
            handler: require('./controller/userSession/delete')
        }];

        return rx.Observable.create(function (o) {

            function handleError (res) {
                o.onNext({
                    data: {
                        error: {
                            message: 'Not authorized'
                        }
                    },
                    res: res
                });
            }

            expressApp.use(function (req, res, next) {
                const appId = req.params.app_id;
                const authHeader = req.headers.authentication;

                if (!authHeader) {
                    handleError(res);
                    return;
                }

                const authType = authHeader.split(' ')[0];
                const authId = authHeader.split(' ')[1].split(':')[0];
                const authHmac = authHeader.split(' ')[1].split(':')[1];

                App.findById(authId, function (err, app) {
                    if (err || !app) {
                        handleError(res);

                        return;
                    }

                    const secret = app.key;
                    const body = JSON.stringify(req.body);
                    const query = JSON.stringify(req.query);
                    
                    const str = (`${req.method}${req.path}${query}${body}`).toLowerCase();
                    const hmac = crypto.createHmac("SHA256", secret).update(str).digest('base64');
                    
                    console.log('str', str);
                    console.log('secret', secret);

                    console.log('hmac', hmac);
                    console.log('authHmac', authHmac);
                    if (hmac !== authHmac) {
                        console.log('handling error');
                        handleError(res);
                    } else {
                        next();
                    }

                });


            });

            routes.forEach(function (data) {

                expressApp[data.method](data.path, function (req, res) {
                    data.handler(req)
                        .subscribe(function (data) {
                            o.onNext({
                                data: {
                                    data: data
                                },
                                res: res
                            });
                        }, function (error) {
                            const errorMessage = error.message ? error.message : error;

                            o.onNext({
                                data: {
                                    error: {
                                        message: errorMessage
                                    }
                                },
                                res: res
                            });
                        })
                });

            
            });

            expressApp.listen(port);
            console.log(`Server started on port ${port}`);

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