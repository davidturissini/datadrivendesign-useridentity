'use strict';

require('node-babel')();
const server = require('whirlpool');


server(process.env.PORT || 4100, [{
    "method": "post",
    "path": "/users",
    "handler": "./src/user/create"
},{
    "method": "get",
    "path": "/users/:user_id",
    "handler": "./src/user/get"
},{
    "method": "post",
    "path": "/userSession",
    "handler": "./src/userSession/create"
},{
    "method": "delete",
    "path": "/userSession",
    "handler": "./src/userSession/delete"
}], {
    cwd: __dirname + '/../'
});
