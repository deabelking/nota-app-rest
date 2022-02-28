const { Router } = require('express');
const { login, logout } = require('../controllers/auth');
const { requiredFields } = require('../middlewares');
const router = Router();

/**Autenticar usuario*/
router.post('/login', [
    requiredFields('password', 'email'),
], login)

router.post('/logout', logout);

module.exports = router;