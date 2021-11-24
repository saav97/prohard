/**
 * Tickets
 * /api/tickets
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { crearTicket, getTickets, actualizarTicket, eliminarTicket, getTicketById, agregarTareas, agregarEstado, eliminarTarea, eliminarEstado } = require('../controllers/ticket');
const { validarCampos } = require('../middlewares/validar-campo');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getTickets);
router.get('/:id', validarJWT, getTicketById);

router.post('/',
    [
        validarJWT,
        check('tipo', 'El tipo de dispositivo es requerido').not().isEmpty(),
        check('marca', 'La marca del Equipo es requerido').not().isEmpty(),
        check('fechaCargaIso', 'la fecha de carga del ticket es requerido').not().isEmpty(),
        check('observacionEquipo', 'La observación del equipo es requerida').not().isEmpty(),
        validarCampos
    ]
    , crearTicket
);
router.put('/agregartareas/:id',
    [validarJWT]
    , agregarTareas);


router.put('/agregarestado/:id',
    [validarJWT]
    , agregarEstado);

router.put('/:id',
    [validarJWT]
    , actualizarTicket);

router.put('/eliminartarea/:id',
    [validarJWT],
    eliminarTarea);

router.put('/eliminarestado/:id',
    [validarJWT],
    eliminarEstado);

router.delete('/:id', validarJWT, eliminarTicket);


module.exports = router;