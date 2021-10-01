const { response, request } = require('express');

const Tarea = require('../models/tarea');

const getTareas = async (req, res) => {

    try {
        const desde = Number(req.query.desde) || 0;
        const [tareas, total] = await Promise.all([
            Tarea
                .find()
                .skip(desde)
                .limit(10),
            Tarea.count()
        ])
        res.json({
            ok: true,
            tareas,
            total
        })
    } catch (error) {
        res.json({
            ok:false,
            err: error
        })
    }
}

const getTareaById = async (req, res) => {

    const id = req.params.id;

    try {

        const tarea = await Tarea.findById(id);

        res.json({
            ok: true,
            tarea
        })
    } catch (error) {
        res.json({
            ok: false,
            id,
            msg:'Tarea no encontrado'
        })
    }
};

const crearTarea = async (req, res = response) => {

    const { nombre } = req.body;

    try {
        const existeNombre = await Tarea.findOne({ nombre })
        if (existeNombre) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre de la tarea ya está registrado'
            })
        }

        const tarea = new Tarea(req.body);
        await tarea.save();

        res.json({
            ok: true,
            tarea: tarea
        });

    } catch (error) {
        res.status().json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
};

const actualizarTarea = async (req = request, res = response) => {

    const id = req.params.id;
    const nombre = req.body.nombre
    try {
        let tarea = await Tarea.findById(id);
        if (!tarea) {
            return res.status(404).json({
                ok: true,
                msg: 'tarea no encontrada'
            })
        }
        tarea = await Tarea.findOne({nombre});
        if (tarea) {
            if (tarea.id!=id) {
                return res.status(401).json({
                    ok: false,
                    msg: 'El nombre de la tarea ya existe'
                })
            }
        }
        const cambiosTarea = {
            ...req.body,
        }

        const tareaActualizado = await Tarea.findByIdAndUpdate(id, cambiosTarea, { new: true });

        res.json({
            ok: true,
            msg: 'Tarea Actualizada',
            cliente: tareaActualizado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const eliminarTarea = async (req, res) => {


    const id = req.params.id;

    try {

        const tarea = await Tarea.findById(id);
        if (!tarea) {
            return res.status(404).json({
                ok: true,
                msg: 'tarea no encontrada'
            })
        }

        await Tarea.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Tarea eliminada'
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
    getTareas,
    crearTarea,
    getTareaById,
    actualizarTarea,
    eliminarTarea
}
