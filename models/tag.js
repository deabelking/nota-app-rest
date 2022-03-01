const { Schema, model } = require('mongoose');

const TagSchema = Schema({
    name: {
        type: String,
        required: [true, "nombre es requerido"],
        unique: true,
    },
    active: { type: Boolean, default: true }
});


TagSchema.methods.toJSON = function() {
    const { __v, _id, ...data } = this.toObject();
    data.id = _id;
    return data;
}

module.exports = model('Tag', TagSchema);