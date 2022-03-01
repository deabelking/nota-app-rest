const { response, request } = require("express")


const userContainsRoles = (...roles) => {
    /**self-user=> rol 'virtual' que indica si el registro que se esta intentado acceder corresponde al usuario que hace la peticion */
    return (req = request, res = response, next) => {
        const currentUser = req.user;
        if (!roles.includes(currentUser.rol)) {
            return res.status(401)
                .json({ msg: "Usuario no tiene permiso requerido" });;
        }
        next();
    }
}

module.exports = {
    userContainsRoles
}