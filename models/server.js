const express = require('express');
const cors = require("cors");
const { DBConnection } = require('../helpers/db-config');



class Server {
    constructor() {
        this.app = express();
        this.routesPaths = {
            users: "/api/users"
        };
        this.midleware();
        this.routes();
        this.connectDatabase();

    }

    midleware() {
        this.app.use(cors());
        this.app.use(express.json());
    }
    routes() {
        this.app.use(this.routesPaths.users, require('../routes/users'));
    }

    async connectDatabase() {
        try {
            await DBConnection();
        } catch (err) {
            console.log(err);
        }

    }

    listen() {
        this.app.listen(process.env.PORT, () => { console.log('Server running!'); })
    }
}

module.exports = Server;