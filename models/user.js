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
    active: { type: Boolean, default: true },
    /**Indica si el usuario se creo desde google*/
    google: { type: Boolean, default: false },

    token: { type: String, default: "" },
    created: { type: Number, default: Date.now() }

});

UserSchema.methods.toJSON = function() {
    const { __v, _id, google, token, password, ...rest } = this.toObject();
    rest.id = _id;
    return rest;
}
module.exports = model('User', UserSchema)