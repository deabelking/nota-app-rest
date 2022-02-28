const { Router } = require('express');
const { createNote, getNote, getNotes } = require('../controllers/note');
const { requiredFields, tokenValido, tokenValidoOptional, existsEntityById } = require('../middlewares');
const { Note } = require('../models');

const router = Router();

/**Si el usuario esta logiado, obtiene todas sus notas y ademas las notas publicas, 
 * sino entonces solo las notas publicas */
router.get('/', tokenValidoOptional, getNotes);
router.get('/:id', [
    tokenValidoOptional,
    existsEntityById(Note)
], getNote);

/**Crear una nota */
router.post('/', [
    tokenValido,
    requiredFields('name', 'content'),
], createNote);


module.exports = router;