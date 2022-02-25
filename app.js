require('dotenv').config();

const { Server } = require('./models');
const myServer = new Server();
myServer.listen();