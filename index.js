const express = require('express');
var serveIndex = require('serve-index');


const expressfileUpload = require('express-fileupload');

require('dotenv').config()
var cors = require('cors')

const dbConecction = require('./database/config');
const { urlencoded } = require('express');


//


//Crear el servidor express
const app = express();


//Mostrar Imagenes
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));

//Configurar uploads
app.use(expressfileUpload());

//Configurar cors
app.use(cors());

// Lectura y parseo del body

app.use(express.json());

//Base de datos
//mean_prohard:PLnONL4KUp7UXaKL
dbConecction()

//Directorio Publico

app.use(express.static('public'))

//Rutas

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/tickets', require('./routes/ticket'));
app.use('/api/clientes', require('./routes/cliente'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo', require('./routes/busqueda'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/tareas', require('./routes/tarea'));



app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo en puerto: '+process.env.PORT)
})