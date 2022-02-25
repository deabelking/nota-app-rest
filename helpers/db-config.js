const mongoose = require('mongoose');

const DBConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log("Conexion a base de datos exitosa!");
    } catch (err) {
        console.log(err);
        throw Error("Error al conectar la BBDD");
    }

}


module.exports = { DBConnection };