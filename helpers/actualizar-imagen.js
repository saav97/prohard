const fs = require('fs')
const Usuario = require('../models/usuario')
const Cliente = require('../models/cliente')
const Ticket = require('../models/ticket')

const actualizarImagen = async (tipo, id, nombreArchivo) => {
    console.log(id + tipo + nombreArchivo);
    let pathViejo = '';

    const borrarImagen= (path) =>{
        
        if (fs.existsSync(pathViejo)) {
            //Borrar imagen anterior
            fs.unlinkSync(path);
        }
    }

    switch (tipo) {
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log("No se encontro usuario por id");;
                return false
            }

            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathViejo)
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            break;

        case 'tikets':

            const ticket = await Ticket.findById(id);
            if (!ticket) {
                console.log("No se encontro ticket por id");;
                return false
            }

            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathViejo)
            ticket.img = nombreArchivo;
            await ticket.save();
            return true;
            break;
    }
}

module.exports = {
    actualizarImagen
}