const { Router } = require('express');
const { createTag, getTags, updateTag, deleteTag, getTag } = require('../controllers/tag');
const { Tag } = require('../models');
const {
    tokenValido,
    userContainsRoles,
    uniqueFields,
    requiredFields,
    isMongoValidId,
    existsEntityById
} = require('../middlewares');

const router = Router();
/**Obtener todos los tags activos */
router.get('/', getTags);

/**Obtine un tag a partir del id */
router.get('/:id', [
    isMongoValidId,
    existsEntityById(Tag)
], getTag);

/**Crear tag */
router.post('/', [
    tokenValido,
    uniqueFields(Tag, 'name'),
    requiredFields('name'),
    userContainsRoles('admin')
], createTag);

/**Crear tag */
router.put('/:id', [
    isMongoValidId,
    existsEntityById(Tag),
    tokenValido,
    uniqueFields(Tag, 'name'),
    requiredFields('name'),
    userContainsRoles('admin')
], updateTag);

/**Crear tag */
router.delete('/:id', [
    isMongoValidId,
    existsEntityById(Tag),
    tokenValido,
    uniqueFields(Tag, 'name'),
    requiredFields('name'),
    userContainsRoles('admin')
], deleteTag);

module.exports = router;