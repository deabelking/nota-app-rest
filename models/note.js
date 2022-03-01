const { Schema, model } = require('mongoose');
const NoteSchema = Schema({
    name: {
        type: String,
        required: [true, 'Nombre es requerido'],
    },
    content: {
        type: String,
        required: [true, 'Contenido es requerido'],
    },
    public: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    created: { type: Number, default: Date.now() },
    updated: { type: Number, default: Date.now() },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es requerido']
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag',
    }]
});
NoteSchema.index({ name: 'text', content: 'text' });
NoteSchema.methods.toJSON = function() {
    const { __v, _id, ...rest } = this.toObject();
    rest.id = _id;
    return rest;
}
module.exports = model('Note', NoteSchema);