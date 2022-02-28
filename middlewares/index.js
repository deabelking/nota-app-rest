const fieldsValidators = require('./db-validator');
const auth = require('./auth');


module.exports = {
    ...fieldsValidators,
    ...auth
}