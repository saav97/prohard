// getTodo

const { response, request } = require('express');
const Usuario = require('../models/usuario');
const Cliente = require('../models/cliente');
const Ticket = require('../models/ticket');
const Tarea = require('../models/tarea')


const getTodo = async (req = request, res = response) => {
    try {
        const busqueda = req.params.busqueda;
        const regex = new RegExp(busqueda, 'i');

        const [usuarios, clientes] = await Promise.all([
            Usuario.find({ nombre: regex }),
            Cliente.find({ nombre: regex, apellido: regex })
        ]);

        res.json({
            ok: true,
            usuarios,
            clientes
        })

    } catch (error) {
        res.json({
            ok: false,
            msg: 'Error en la busqueda'
        })
    }
}
const getDocumentoCollection = async (req = reques, res = response) => {
    const { tabla, busqueda } = req.params;
    const regex = new RegExp(busqueda, 'i');
    let data = []

    try {

        switch (tabla) {
            case 'usuarios': data = await Usuario.find({ nombre: regex });
                break;
            case 'clientes': data = await Cliente.find({ $or: [{ nombre: regex }, { apellido: regex }, { email: regex }] })
                .populate('usuario', 'nombre apellido')
                break;
            case 'tickets': data = await Ticket.find({ $or: [{ nroServicio: regex }, { estadoTicket: regex }] })
                .populate('cliente', 'nombre apellido')
                .populate('estados.usuario', 'nombre apellido')
                break;
            case 'tareas': data = await Tarea.find({ nombre: regex })
                console.log(data)
                break;
            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'La tabla tiene que ser usuarios,clientes,tickets'
                })
        }

        res.json({
            ok: true,
            resultados: data
        })

    } catch (error) {
        res.json({
            ok: false,
            msg: 'Error en la busqueda'
        })

    }
}
module.exports = {
    getTodo,
    getDocumentoCollection
}