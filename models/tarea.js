const mongoose = require('mongoose');

const TareaSchema = mongoose.Schema({
    nombre:{
        type: String,
        require: true
    },
    precio: {
        type: Number,
        require: true
    }
});

TareaSchema.method('toJSON', function(){
    const {__v,_id, ...object} = this.toObject();

    object.taid = _id;
    return object;
});




module.exports = mongoose.model('Tarea', TareaSchema);