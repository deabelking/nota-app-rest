const { response } = require("express");
const { User } = require('../models');

const getUsers = async(req = require, res = response) => {
    const user = new User();
    user.name = "Dv";
    user.password = "Dv";
    user.email = "Dv";
    await user.save();
    res.json({ msg: "hola" })
}

module.exports = {
    getUsers
}