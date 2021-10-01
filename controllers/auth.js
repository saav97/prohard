const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

const login = async (req, res = response) => {

    const { email, password } = req.body;
    try {

        //verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no valido'
            })
        }

        //verificar contraseñas

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            })
        }

        //generar el TOKENT - JWT

        const token = await generarJWT(usuarioDB._id);

        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd(usuarioDB.role)
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const googleSingIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({ email });

        let usuario;
        if (!usuarioDB) {

            // si el usuario no existe
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            //existe usuario

            usuario = usuarioDB;
            usuario.google = true;
            usuario.password = '@@@'
        }
        //guardar en base de datos

        await usuario.save();

        //generar el TOKENT - JWT

        //const token = await generarJWT(usuario._id);

        res.json({
            ok: true,
            msg: 'Google SingIn',
            name, email, picture
        })
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'El token no es correcto'
        })
    }
}


const renewToken = async (req, res = response) => {

    const uid = req.uid

    //Generar el Token -JWT
    const token = await generarJWT(uid);

    //Obterner el usuario por id

    const users = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        users,
        menu: getMenuFrontEnd(users.role)
    })
}

module.exports = {
    login,
    googleSingIn,
    renewToken
}
