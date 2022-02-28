const express = require('express');
const cors = require("cors");
const { DBConnection } = require('../helpers/db-config');



class Server {
    constructor() {
        this.app = express();
        this.routesPaths = {
            auth: "/api/auth",
            notes: "/api/notes",
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
        this.app.use(this.routesPaths.notes, require('../routes/notes'));
        this.app.use(this.routesPaths.auth, require('../routes/auth'));
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