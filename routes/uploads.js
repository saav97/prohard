const { Router } = require('express')
const { fileUplaod, retornaImagen } = require('../controllers/uploads');
const { validarJWT } = require('../middlewares/validar-jwt')
/**
 * 
 * ruta: api/uploads/
 * 
 */

const router = Router();


router.put('/:tipo/:id',validarJWT,fileUplaod);
router.get('/:tipo/:foto',retornaImagen);


module.exports = router