/**
 * Tickets
 * /api/clientes
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { getClientes, crearCliente, actualizarCliente, eliminarCliente, getClienteById, agregarTicket } = require('../controllers/cliente');
const { validarCampos } = require('../middlewares/validar-campo');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getClientes);

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre del cliente es necesario').not().isEmpty(),
        check('apellido', 'El apellido del cliente es necesario').not().isEmpty(),
        check('email', 'El email del cliente es necesario').isEmail(),
        check('telefono', 'El telefono del cliente es necesario').not().isEmpty(),
        check('ciudad', 'La ciudad del cliente es necesario').not().isEmpty(),
        check('calle', 'La calle del cliente es necesario').not().isEmpty(),
        validarCampos
    ]
    , crearCliente
);

router.put('/:id',
    [
        validarJWT,
        check('email', 'El email del cliente es obligatorio').isEmail(),
        validarCampos
    ]
    , actualizarCliente);

    router.put('/ticket/:id',
    [
        validarJWT,
        validarCampos
    ]
    , agregarTicket);

router.delete('/:id',
    [
        validarJWT
    ],
    eliminarCliente);

router.get('/:id',
    [
        validarJWT
    ],
    getClienteById
)


module.exports = router;