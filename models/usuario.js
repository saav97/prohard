const { mongo } = require('mongoose');
const mongoose = require('mongoose');

const UsuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true
    },
    img:{
        type:String
    },
    role:{
        type: String,
        required:true,
        default: 'USER_ROLE'
    },
    google:{
        type:Boolean,
        dafault:false
    }
});

UsuarioSchema.method('toJSON', function(){
    const {__v,_id, password, ...object} = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = mongoose.model('Usuario', UsuarioSchema);