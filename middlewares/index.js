const fieldsValidators = require('./db-validator');
const auth = require('./auth');
const roleValidator = require('./role-validator');
const validateImage = require('./validate-image');


module.exports = {
    ...fieldsValidators,
    ...auth,
    ...roleValidator,
    ...validateImage
}