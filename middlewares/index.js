const fieldsValidators = require('./db-validator');
const auth = require('./auth');
const roleValidator = require('./role-validator');


module.exports = {
    ...fieldsValidators,
    ...auth,
    ...roleValidator
}