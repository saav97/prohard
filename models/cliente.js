
const mongoose = require('mongoose');

const ClienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        required:true
    },
    apellido: {
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    telefono:{
        type: String,
        required:true,
    },
    ciudad:{
        type:String,
        required:true,
    },
    calle:{
        type:String,
        required:true,
    },
    numero:{
        type:String,
        required:false,
    },
    piso:{
        type:String,
        required:false,
        default: ''
    },
    departamento:{
        type:String,
        required:false,
        default: ''
    },
    usuario:{
        required:true, //El cliente tiene la referencia del usuario que lo creo. si o si un usuario crear un cliente!
        type: mongoose.Schema.Types.ObjectId,
        ref:'Usuario'
    },
    tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }]
});

ClienteSchema.method('toJSON', function(){
    const {__v,_id, ...object} = this.toObject();

    object.cid = _id;
    return object;
});

module.exports = mongoose.model('Cliente', ClienteSchema);