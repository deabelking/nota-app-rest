const users = require('./user');
const notes = require('./note');



module.exports = {
    ...users,
    ...notes
}