const { response, request } = require('express');
const cliente = require('../models/cliente');

const Cliente = require('../models/cliente');

const getClientes = async (req, res) => {

    try {
        const desde = Number(req.query.desde) || 0;

        const [clientes, total] = await Promise.all([
            Cliente
                .find()
                .skip(desde)
                .limit(5)
                .populate('usuario', 'nombre'),

            Cliente.count()
        ])

        res.json({
            ok: true,
            clientes,
            total
        })
    } catch (error) {

    }

}

const getClienteById = async (req, res) => {

    const id = req.params.id;

    try {

        const cliente = await Cliente.findById(id)
                                .populate('usuario', 'nombre apellido')
                                .populate('tickets')

        res.json({
            ok: true,
            cliente
        })
    } catch (error) {
        res.json({
            ok: false,
            id,
            msg:'Cliente no encontrado'
        })
    }
}


const crearCliente = async (req, res = response) => {

    const { email } = req.body;

    try {
        const existeEmail = await Cliente.findOne({ email })
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            })
        }

        const cliente = new Cliente({
            usuario: req.uid,
            ...req.body
        });
        const clienteDB = await cliente.save();

        res.json({
            ok: true,
            cliente: cliente
        });

    } catch (error) {
        res.status().json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const agregarTicket = async(req = request, res=Response) =>{
    const cid = req.params.id;
    const {email, tickets} = req.body
    try {
        await cliente.updateOne({_id:cid}, {$addToSet:{tickets:[tickets]}})  
        res.json({
            msg:'Cliente actualizado',
            idCliente: cid
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    
}

const actualizarCliente = async (req = request, res = response) => {

    const id = req.params.id;
    const uid = req.uid;
    const email = req.body.email
    try {
        const cliente = await Cliente.findById(id);
        console.log(id)
        if (!cliente) {
            return res.status(404).json({
                ok: true,
                msg: 'cliente no encontrado'
            })
        }
        const existeEmail = await Cliente.findOne({email});
        if (existeEmail) {
            console.log(existeEmail.email);
            if (existeEmail.id!=id) {
                return res.status(401).json({
                    ok: false,
                    msg: 'El email ya existe'
                })
            }
        }
        const cambiosCliente = {
            ...req.body,
            usuario: uid
        }

        const clienteActualizado = await Cliente.findByIdAndUpdate(id, cambiosCliente, { new: true });

        res.json({
            ok: true,
            msg: 'Actualizar Cliente',
            cliente: clienteActualizado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const eliminarCliente = async (req, res) => {


    const id = req.params.id;

    try {

        const cliente = await Cliente.findById(id);
        if (!cliente) {
            return res.status(404).json({
                ok: true,
                msg: 'cliente no encontrado'
            })
        }

        if(cliente.tickets.length!=0){
            return res.status(401).json({
                ok:false,
                msg: 'El cliente no puede ser eliminado'
            })
        }

        await Cliente.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Cliente Eliminado'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


module.exports = {
    getClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    getClienteById,
    agregarTicket
}