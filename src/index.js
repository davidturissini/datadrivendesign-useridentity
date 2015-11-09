'use strict';

const server = require('data-driven-design-server-bootstrap');


server(4100, [{
    "method": "post",
    "path": "/users",
    "handler": "./src/user/create"
},{
    "method": "get",
    "path": "/users/:id",
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
