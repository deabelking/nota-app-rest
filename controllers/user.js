const { response, request } = require("express");
const { User } = require('../models');

const getUsers = async(req = require, res = response) => {
    const user = new User();
    user.name = "Dv";
    user.password = "Dv";
    user.email = "Dv";
    await user.save();
    res.json({ msg: "hola" });
}

const getUser = async(req = request, res = response) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json(user);
}

const createUser = async(req = request, res = response) => {
    const { name, password, email, rol } = req.body;
    const data = { name, password, email, rol };
    const user = new User(data);
    user.created = Date.now();
    await user.save();
    res.status(201).json(user);
}

module.exports = {
    createUser,
    getUser,
    getUsers,
}