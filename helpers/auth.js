const jwt = require('jsonwebtoken');

const generatorTokenJWT = (uuid, expiresIn = '4h') => {
    const privateKey = process.env.PRIVATE_KEY_JWT;
    const token = jwt.sign({ uuid }, privateKey, { expiresIn });
    return token;
}

const verifyTokenJWT = (token = '') => {
    return new Promise((resolve, reject) => {
        const privateKey = process.env.PRIVATE_KEY_JWT;
        if (token === '') {
            return reject("No se proporciono token");
        }
        jwt.verify(token, privateKey, function(err, decoded) {
            if (err) {
                return reject("Token no valido");
            }
            return resolve(decoded);
        });
    });
}

module.exports = {
    generatorTokenJWT,
    verifyTokenJWT
}