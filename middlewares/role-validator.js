const { response, request } = require("express")


const userContainsRoles = (...roles) => {
    /**self-user=> rol 'virtual' que indica si el registro que se esta intentado acceder corresponde al usuario que hace la peticion */
    return (req = request, res = response, next) => {
        const currentUser = req.user;
        if (roles.includes('self-user')) {
            const { id } = req.params;
            if (currentUser.id === id) {
                next();
                return;
            }
        } else if (roles.includes(currentUser.rol)) {
            next();
            return;
        }
        res.status(403)
            .json({ msg: "Usuario no tiene permiso requerido" });
    }
}

module.exports = {
    userContainsRoles
}