const { Schema, model } = require('mongoose');


const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El campo name es requerido']
    },
    email: {
        type: String,
        required: [true, 'El campo email es requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El campo password es requerido'],
    },
    rol: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    photo: { type: String },
    public: { type: Boolean, default: false },
    state: { type: Boolean, default: true },
    /**Indica si el usuario se creo desde google*/
    google: { type: Boolean, default: false }

});

module.exports = model('users', UserSchema)