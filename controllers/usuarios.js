const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
    const desde = Number(req.query.desde) || 0;
    const [usuarios, total] = await Promise.all([
        Usuario
            .find()
            .skip(desde)
            .limit(5)
            .populate('usuario', 'nombre'),
        Usuario.count()
    ])

    res.json({
        ok: true,
        usuarios,
        total
    });
}

const crearUsuarios = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const existeEmail = await Usuario.findOne({ email })

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            })
        }
        const usuario = new Usuario(req.body);

        // Encriptar contraseña

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardar Usuarios
        await usuario.save();

        //generar el TOKENT - JWT
        const uid = usuario.id;
        const token = await generarJWT(usuario._id);

        res.json({
            ok: true,
            uid,
            token

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}

const actualizarUsuario = async (req, res = response) => {
    const uid = req.params.id

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                of: false,
                msg: 'No existe un usuario por ese id'
            })
        }

        // Actualizaciones

        const {password, google, email, ...campos} = req.body;
        
        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    error: 'Ya existe el usuario con ese email'
                })
            }
        } 

        campos.email = email
    
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error: 'Error inesperado'
        })

    }
}

const eliminarUsuario = async (req, res=response) =>{
    const uid = req.params.id
    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                of: false,
                msg: 'No existe un usuario por ese id'
            })
        }

        //borrado

        await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
            ok:true,
            uid
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            error: 'Error inesperado'
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    eliminarUsuario
}