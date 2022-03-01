const { Router } = require('express');
const { createNote, getNote, getNotes, searchNote, updateNote } = require('../controllers/note');
const { requiredFields, tokenValido, tokenValidoOptional, existsEntityById, userContainsRoles, isMongoValidId, isUserOwnerDocument } = require('../middlewares');
const { Note } = require('../models');

const router = Router();

/**Si el usuario esta logiado, obtiene todas sus notas y ademas las notas publicas, 
 * sino entonces solo las notas publicas */
router.get('/', tokenValidoOptional, getNotes);

router.get('/:id', [
    tokenValidoOptional,
    existsEntityById(Note)
], getNote);

/**Busqueda a traves de tag,name,content,user */
router.get('/search/:field/:value', tokenValidoOptional, searchNote);

/**Crear una nota */
router.post('/', [
    tokenValido,
    requiredFields('name', 'content'),
], createNote);

router.put('/:id', [
    isMongoValidId,
    tokenValido,
    existsEntityById(Note),
    isUserOwnerDocument('user')
], updateNote);


module.exports = router;