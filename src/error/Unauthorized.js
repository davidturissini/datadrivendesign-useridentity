'use strict';


class Unauthorized extends Error {

    constructor (message) {
        super(...arguments);

        this.message = message;
        this.status = 401;
    }

}

module.exports = Unauthorized;