const { Router } = require('express');
const { getUsers, createUser, getUser } = require('../controllers');
const { requiredFields, uniqueFields, isMongoValidId, existsEntityById } = require('../middlewares');
const { User } = require('../models');



const myRouter = Router();
/**EndPoint que retorna todos los usuarios, posiblemente solo el admin tenga acceso a este Endpoint*/
myRouter.post('/', [
    requiredFields('name', 'password', 'email'),
    uniqueFields(User, 'email'),
], createUser);

/**Obtiene el usuario a partir del id*/
myRouter.get('/:id', [
    isMongoValidId,
    existsEntityById(User),
], getUser);
myRouter.get('/', getUsers);


module.exports = myRouter;