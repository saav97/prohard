const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {
    return new Promise((resolved, reject) => {
        const payload = {uid};
        console.log("vino aca");
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            }else{
                console.log("vino aca");
                resolved(token);
            }
        });
    });

}

module.exports = {
    generarJWT
}