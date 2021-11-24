const { response, request } = require('express');
const Estado = require('../models/estado');

const Ticket = require('../models/ticket');
const { patch } = require('../routes/ticket');

const getTickets = async (req, res) => {

    try {
        const desde = Number(req.query.desde) || 0;
        const [tickets, total] = await Promise.all([
            Ticket
                .find()
                .skip(desde)
                .limit(10)
                .populate('usuario', 'nombre')
                .populate('cliente', 'nombre apellido')
                .populate({ path: 'tareas', model: 'Tarea' })
                .populate('estados.usuario', 'nombre apellido'),
            Ticket.count()
        ])


        res.json({
            ok: true,
            tickets,
            total
        })
    } catch (error) {
        res.json({
            ok: false,
            err: error
        })
    }
}


const getTicketById = async (req, res) => {

    const id = req.params.id;

    try {

        const ticket = await Ticket.findById(id)
            .populate('cliente', 'nombre apellido email direccion telefono calle ciudad numero departamento piso')
            .populate('usuario', 'nombre')
            .populate({ path: 'tareas', model: 'Tarea' })
            .populate('estados.usuario', 'nombre apellido')


        res.json({
            ok: true,
            ticket
        })
    } catch (error) {
        res.json({
            ok: false,
            id,
            msg: 'Ticket no encontrado'
        })
    }

}

const crearTicket = async (req, res = response) => {

    //const { nroServicio } = req.body

    const uid = req.uid;

    try {
        /* existeNroServicio = await Ticket.findOne({ nroServicio });
 
         if (existeNroServicio) {
             return res.status(400).json({
                 ok: false,
                 msg: 'El numero de servicio ya fue generado'
             })
         }*/
        console.log(req.body)
        const ticket = new Ticket({
            usuario: uid,
            estados: [{
                fechaEstadoIso: new Date(),
                usuario: uid
            }],
            cliente: req.body.cid,
            ...req.body
        });

        await ticket.save();

        res.json({
            ok: true,
            ticket: ticket
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const actualizarTicket = async (req = request, res = response) => {

    const id = req.params.id;
    const uid = req.uid

    try {

        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({
                ok: false,
                msg: 'Ticket no encontrado'
            })
        }

        const cambiosTicket = {
            ...req.body,
            usuario: uid
        }

        const ticketActualizado = await Ticket.findByIdAndUpdate(id, cambiosTicket, { new: true });

        res.json({
            ok: true,
            msg: 'Ticket Actualizado',
            ticket: ticketActualizado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const agregarEstado = async (req = request, res = response) => {
    const cid = req.params.id;
    const { estadoTicket, fechaEstadoIso, detalle } = req.body
    const nuevoEstado = {
        estadoTicket,
        fechaEstadoIso,
        detalle,
        usuario: req.uid
    }

    try {
        await Ticket.updateOne({ _id: cid }, { $push: { "estados": nuevoEstado } }, { strict: false });
        res.json({
            ok: true,
            msg: "Estado actualizado"
        })
        const cambiosTicket = {
            estadoTicket: estadoTicket
        }

        await Ticket.findByIdAndUpdate(cid, cambiosTicket, { new: true });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const eliminarEstado = async (req = request, res = response) => {
    const tid = req.params.id;
    const { fechaEstadoIso } = req.body

    try {
        ticket = await Ticket.findById(tid);

        ticket.estados = ticket.estados.filter((item) => {
            return item.fechaEstadoIso.getTime() !=  new Date(fechaEstadoIso).getTime();
        })

        const ticketActualizado = await Ticket.findByIdAndUpdate(tid, ticket, { new: true });

        res.json({
            ok: true,
            msg: 'Ticket Actualizado',
            ticket: ticketActualizado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const agregarTareas = async (req = request, res = response) => {
    const cid = req.params.id;
    let { tareas } = req.body
    const uid = req.uid

    try {
        // Actualizamos las tareas
        // obtengo el ticket
        ticket = await Ticket.findById(cid);

        //Verifico si tenemos elementos repetidos

        if (ticket.tareas.lenght != 0) {
            tareas = buscaRepetidos(tareas, ticket.tareas);
        }

        if(tareas.lenght!=0){
            await Ticket.updateOne({ _id: cid }, { $push: { "tareas": tareas } }, { strict: false });
        }

        res.json({
            ok: true,
            msg: 'Ticket Actualizado',
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const buscaRepetidos = (tareasIngresadas, tareas) => {

    //obtengo duplicados
    let duplicados = tareas.filter(v => tareasIngresadas.includes(v.toString())
    );


    //elimino duplicados
    if (duplicados.lenght != 0) {
        for(let e of duplicados){
            tareasIngresadas = tareasIngresadas.filter((item) => item!= e)
        } 
    }
    return tareasIngresadas;

}

const eliminarTarea = async (req = request, res = response) => {
    const tid = req.params.id;

    const { taid } = req.body;

    console.log(tid, taid);

    try {
        const ticket = await Ticket.findById(tid);
        if (!ticket) {
            return res.status(404).json({
                ok: true,
                msg: 'Ticket no encontrado'
            });
        }

        ticket.tareas = ticket.tareas.filter((item) => {
            return item != taid
        })

        const ticketActualizado = await Ticket.findByIdAndUpdate(tid, ticket, { new: true });

        res.json({
            ok: true,
            msg: 'Ticket Actualizado',
            ticket: ticketActualizado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const eliminarTicket = async (req, res) => {
    const id = req.params.id;

    try {

        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({
                ok: true,
                msg: 'Ticket no encontrado'
            })
        }

        await Ticket.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Ticket Eliminado'
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
    getTickets,
    crearTicket,
    actualizarTicket,
    eliminarTicket,
    getTicketById,
    agregarTareas,
    agregarEstado,
    eliminarTarea,
    eliminarEstado
}