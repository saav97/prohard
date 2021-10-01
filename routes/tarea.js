const { Router } = require('express');
const { check } = require('express-validator');
const { getTareas, getTareaById, crearTarea, actualizarTarea, eliminarTarea } = require('../controllers/tarea');
const { validarCampos } = require('../middlewares/validar-campo');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getTareas);
router.get('/:id', validarJWT, getTareaById);

router.post('/',
    [
        validarJWT,
        validarCampos
    ]
    , crearTarea
);

router.put('/:id',
    [validarJWT]
    , actualizarTarea);

router.delete('/:id', validarJWT, eliminarTarea);


module.exports = router;