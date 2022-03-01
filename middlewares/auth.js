const { response, request } = require("express");
const { verifyTokenJWT } = require("../helpers/auth");
const { User } = require("../models");

const tokenValido = async(req = request, res = response, next) => {
    const token = req.header("x-token");
    try {
        const payload = await verifyTokenJWT(token);
        const { uuid } = payload;
        const user = await User.findById(uuid);
        if (!user || !user.active) {
            return res.status(401).json({ msg: "Usuario no existe2" });
        } else if (user.token !== token) {
            return res.status(403).json({ msg: "Token no valido, inicie sessión nuevamente" });
        }
        req.user = user;
    } catch (msg) {
        return res.status(400).json({ msg });
    }
    next();
}

const tokenValidoOptional = async(req = request, res = response, next) => {
    const token = req.header("x-token");
    if (token) {
        let user = null;
        try {
            const payload = await verifyTokenJWT(token);
            const { uuid } = payload;
            user = await User.findById(uuid);
            req.user = user;
        } catch (err) {
            user = null;
        }
        if (!user || !user.active) {
            return res.status(400).json({ msg: "Usuario no existe" });
        }
    }
    next();
}

module.exports = {
    tokenValido,
    tokenValidoOptional
}