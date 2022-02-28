const { response, request } = require("express");
const bcrypt = require('bcryptjs');
const { User } = require("../models");
const { generatorTokenJWT, verifyTokenJWT } = require("../helpers/auth");

const login = async(req = request, res = response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.active) {
        return res.status(401).json({ msg: "Email o password incorrectos" });
    }
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) {
        return res.status(401).json({ msg: "Email o password incorrectos" });
    }
    const token = generatorTokenJWT(user._id);
    user.token = token;
    await user.save();
    res.json({ token });
}

const logout = async(req = request, res = response) => {
    const token = req.header("x-token");
    try {
        const payload = await verifyTokenJWT(token);
        const { uuid: id } = payload;
        await User.findByIdAndUpdate(id, { token: "" });
    } catch (err) {}
    res.json({ msg: "Cierre de session exitoso!" });
}

module.exports = {
    login,
    logout
}