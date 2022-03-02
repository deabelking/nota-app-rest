const { response, request } = require("express");
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { excludeEmpty, emailValidate } = require("../helpers/data-validate");
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const getUsers = async(req = request, res = response) => {
    const { start = 0, end = 5, active = 1 } = req.query;
    const query = { active };
    const [users, total] = await Promise.all([
        User.find(query)
        .skip(Number(start))
        .limit(Number(end)),
        User.countDocuments(query)
    ]);
    res.json({ total, users });
}

const getUser = async(req = request, res = response) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json(user);
}

const createUser = async(req = request, res = response) => {
    const { name, password, email, rol } = req.body;
    const data = { name, email, rol };
    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(password, salt);
    const user = new User(data);
    user.created = Date.now();
    await user.save();
    res.status(201).json(user);
}

const updateUser = async(req = request, res = response) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const data = excludeEmpty({ name, email });
    const userDB = await User.findById(id);
    if (data.email && !emailValidate(data.email)) {
        return res.status(400).json({ msg: 'Acción no realizada, revise email' });
    }
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    res.json(user);
}

const updateImage = async(req = request, res = response) => {
    const { id } = req.params; //req.files.archivo    
    const user = await User.findById(id);
    try {
        const { tempFilePath } = req.files.photo;
        if (user.photo) {
            const imageSplit = user.photo.split('/');
            const name = imageSplit[imageSplit.length - 1];
            const [cloudinaryId] = name.split('.');
            await cloudinary.uploader.destroy(cloudinaryId);
        }
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        user.photo = secure_url;
        await user.save();
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ msg: "hey algo paso," });
    }

}

const updatePasswordUser = async(req = request, res = response) => {
    const { id } = req.params;
    const { password = '', oldPassword = '' } = req.body;
    const userDB = await User.findById(id);
    const data = {};
    /**Actualiza el password*/
    if (password) {
        const salt = bcrypt.genSaltSync(10);
        const samePassword = bcrypt.compareSync(oldPassword, userDB.password);
        if (!samePassword) {
            return res.status(400).json({ msg: 'Acción no realizada, revise la contraseña' });
        }
        data.password = bcrypt.hashSync(password, salt);
        const user = await User.findByIdAndUpdate(id, data, { new: true });
        return res.json(user);
    }
    res.status(400).json({ msg: 'Acción no realizada, revise la contraseña' });
}

const deleteUser = async(req = request, res = response) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { active: false });
    res.json(user);
}

module.exports = {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser,
    updatePasswordUser,
    updateImage
}