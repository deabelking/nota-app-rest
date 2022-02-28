const { response, request } = require("express");
const res = require("express/lib/response");
const mongoose = require('mongoose');


const requiredFields = (...fields) => {
    console.log(fields);
    return (req = request, res = response, next) => {
        const body = req.body;
        const missingFields = [];
        fields.forEach(field => {
            if (!(field in body)) {
                missingFields.push(field);
            }
        });

        if (missingFields.length !== 0) {
            return res.status(401)
                .json({ msg: `Faltan los campos:${missingFields}` });
        }
        next();
    }
}

const uniqueFields = (Entity, ...fields) => {
    return async(req = request, res = response, next) => {
        const { id = '' } = req.params;
        let msg = '';
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const value = req.body[field];
            const query = {
                [field]: value
            };
            const entity = await Entity.findOne(query);
            if (entity && entity._id !== id) {
                msg += `Ya existe un registro en el campo ${field} con valor ${value}\n`;
            }
        }
        if (msg !== '') {
            return res.status(401)
                .json({ msg: msg.trimEnd('\n') });
        }
        next();
    }
}

const isMongoValidId = (req = request, res = response, next) => {
    const { id } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        return res.status(401).json({ msg: `El id ${id} no es valido` });
    }
    next();
}

const existsEntityById = (Entity) => {

    return async(req = request, res = response, next) => {
        const { id } = req.params;
        const entity = await Entity.findById(id);
        if (!entity) {
            return res.status(401).json({ msg: `No existe un registro asociado al id :${id}` });
        }
        next();
    }
}


module.exports = {
    existsEntityById,
    isMongoValidId,
    requiredFields,
    uniqueFields
}