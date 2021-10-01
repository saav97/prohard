const mongoose = require('mongoose');

const EstadoSchema = mongoose.Schema({
    estado:{
        type: String,
        required: true,
        default: 'nuevo'
    },
    fechaEstadoIso:{
        type: Date,
        required: true,
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    }
});

// Establecemos un campo virtual
EstadoSchema.virtual('fechaCarga')
  .set(function(fecha) {
    // El formato esperado es 'yyyy-mm-dd' que es el devuelto por el campo input
    // el valor recibido se almacenará en el campo fecha_nacimiento_iso de nuestro documento
    this.fechaCarga = new Date(fecha);
  })
  .get(function(){
    // el valor devuelto será un string en formato 'yyyy-mm-dd'
    return this.fechaCarga.toISOString().substring(0,10);
  });


module.exports = mongoose.model('Estado', EstadoSchema);