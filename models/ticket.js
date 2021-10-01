const mongoose = require('mongoose');
const { stringify } = require('uuid');

const TicketSchema = mongoose.Schema({
    marca: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true,
    },
    fechaCargaIso: {
        type: Date,
        required: true
    },
    observacionEquipo: {
        type: String,
        required: true,
    },
    bateria:{
        type: Boolean,
        default: false
    },
    funda:{
        type: Boolean,
        default: false
    },
    mouse:{
        type: Boolean,
        default: false
    },
    cargador:{
        type: Boolean,
        default: false
    },
    estadoTicket:{
        type: String,
        default: 'Nuevo'
    },
    estados:[{
        estadoTicket:{
            type: String,
            default: 'Nuevo',
        },
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Usuario'
        },
        detalle:{
            type: String,
            default: 'Recien cargado'
        },
        fechaEstadoIso:{
            type:Date
        }
    }],
    estadoEquipo:{
        type: String,
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cliente'
    },
    diagnostico:{
        type:String,
        default: 'sin diagnosticar'
    },
    img:{
        type:String
    },
    tareas:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tarea'
    }],
});

// Establecemos un campo virtual
TicketSchema.virtual('fechaCarga')
  .set(function(fecha) {
    // El formato esperado es 'yyyy-mm-dd' que es el devuelto por el campo input
    // el valor recibido se almacenará en el campo fecha_nacimiento_iso de nuestro documento
    this.fecha_carga = new Date(fecha);
  })
  .get(function(){
    // el valor devuelto será un string en formato 'yyyy-mm-dd'
    return this.fecha_carga.toISOString().substring(0,10);
  });


/*TicketSchema.pre("save", function (next) {
    var doc = this;
    counter.findByIdAndUpdate(
        { _id: 'userID' },
        { $inc: { seq: 1 } }
        , function (error, c ) {
            if (error)
                return next(error);
            else if (!c) {
                c = new counter({ _id: 'userID' }, { $inc: { seq: 1 } });
                c.save(function () {
                    doc.userID = (c.seq - 1) + '';
                    next();
                });
            } else {
                doc.userID = counter.seq.toString();
                next();
            }
        });
});*/

TicketSchema.method('toJSON', function(){
    const {__v,_id, ...object} = this.toObject();

    object.tid = _id;
    return object;
});


module.exports = mongoose.model('Ticket', TicketSchema);