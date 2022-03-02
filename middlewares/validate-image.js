const { request, response } = require("express");

const validateImage = (...validExtensions) => {
    return (req = request, res = response, next) => {
        console.log(Object.keys(req.files));
        if (!req.files || !Object.keys(req.files).includes('photo')) {
            return res.status(400).json({ msg: "Sin imagen para actualizar" });
        }
        ''.toLocaleLowerCase
        const fullName = req.files.photo.name;
        const splitName = fullName.toLowerCase().split('.');
        const extension = splitName[splitName.length - 1];
        if (!validExtensions.includes(extension)) {
            return res.status(400).json({ msg: "Archivo no valido" });
        }
        next();
    }
}

module.exports = { validateImage };