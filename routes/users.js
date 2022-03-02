const { Router } = require('express');
const { getUsers, createUser, getUser, updateUser, deleteUser, updatePasswordUser, updateImage } = require('../controllers');
const { requiredFields, uniqueFields, isMongoValidId, existsEntityById, isUserOwnerDocument, validateImage } = require('../middlewares');
const { tokenValido } = require('../middlewares/auth');
const { userContainsRoles } = require('../middlewares/role-validator');
const { User } = require('../models');



const myRouter = Router();

/*Solo el admin puede ver los usuarios*/
myRouter.get('/', [
    tokenValido,
    userContainsRoles('admin')
], getUsers);

/**Obtiene el usuario a partir del id, solo el admin y el usuario id puede ver esto*/
myRouter.get('/:id', [
    isMongoValidId,
    tokenValido,
    existsEntityById(User),
    isUserOwnerDocument('_id')
], getUser);


/**EndPoint que retorna todos los usuarios, posiblemente solo el admin tenga acceso a este Endpoint*/
myRouter.post('/', [
    requiredFields('name', 'password', 'email'),
    uniqueFields(User, 'email'),
], createUser);


myRouter.put("/:id", [
    isMongoValidId,
    tokenValido,
    existsEntityById(User),
    isUserOwnerDocument('_id')
], updateUser)

myRouter.put("/image/:id", [
    isMongoValidId,
    tokenValido,
    validateImage('png', 'jpg', 'jpeg'),
    existsEntityById(User),
    isUserOwnerDocument('_id')
], updateImage)

myRouter.put("/password/:id", [
    isMongoValidId,
    tokenValido,
    requiredFields('password', 'oldPassword'),
    existsEntityById(User),
    isUserOwnerDocument('_id')
], updatePasswordUser)

myRouter.delete('/:id', [
    isMongoValidId,
    tokenValido,
    existsEntityById(User),
    userContainsRoles('admin'),
], deleteUser);


module.exports = myRouter;