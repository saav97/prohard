
const path = require('path');
const fs = require('fs');
const { request, response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");


const fileUplaod = (req = request, res = response) => {


    const { tipo, id } = req.params;
    console.log(tipo);

    //validar tipos
    const tiposValidos = ['usuarios', 'clientes', 'tickets'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un Usuarios, cliente o tickets'
        })
    }

    //validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    //Procesar la imagen...
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.'); //imagen.1.2.jpg
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extension

    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    // Generar el nombre del archivo

    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`

    // Path para guardar la imagen

    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //mover la imagen

    file.mv(path, (err) => {
        if (err){
            console.log(err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            })
        }

        //Actualizar Base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        })
    })

    
}

const retornaImagen = (req, res = response)=>{
    const {tipo, foto} = req.params;

    const pathImg = path.join(__dirname,`../uploads/${tipo}/${foto}`);

    //Imagen por defecto

    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg)
    }else{
        const pathImg = path.join(__dirname, `../uploads/noimagen.png`)
        res.sendFile(pathImg);
    }

    //Para que responda con el path de la imagen!
    res.sendFile(pathImg);
}

module.exports = {
    fileUplaod,
    retornaImagen
}