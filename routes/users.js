const { Router } = require('express');
const { getUsers } = require('../controllers');


const myRouter = Router();
/**EndPoint que retorna todos los usuarios, posiblemente solo el admin tenga acceso a este Endpoint*/
myRouter.get('/', getUsers);


module.exports = myRouter;