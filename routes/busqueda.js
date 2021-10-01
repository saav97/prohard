const { Router } = require('express')
const { getTodo, getDocumentoCollection } = require('../controllers/busqueda')
const { validarJWT } = require('../middlewares/validar-jwt')
/**
 * 
 * ruta: api/todo/:busqueda
 * 
 */

const router = Router();


router.get('/:busqueda',
    validarJWT,
    getTodo);

router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentoCollection)


module.exports = router