var express = require('express');
var port = process.port || 4201;
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
const { createServer } = require('https');
const { Server } = require('socket.io');

require('dotenv').config();

var app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "https://api-14-kj41.onrender.com/api/",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket)=>{
    console.log("socket connected");
    
    socket.on('send-invitacion', function(data){
        io.emit('new-invitacion', data);
    });

    socket.on('set-invitacion', function(data){
        io.emit('set-new-invitacion', data);
    });

    socket.on('on-notificacion', function(data){
        io.emit('emit-notificacion', data);
    });

    socket.on('set-message', function(data){
        io.emit('new-message', data);
    });

});

var usuario_routes = require('./routes/usuario');
var post_routes = require('./routes/post');
var pagina_routes = require('./routes/pagina');
var canal_routes = require('./routes/canal');

//conexión entorno local
/*mongoose.connect('mongodb://127.0.0.1:27017/eyngel-social')
    .then(() => {
        app.listen(port, () => console.log("Servidor escuchando en el puerto", port));
    })
    .catch((err) => {
        console.error(err);
    });*/

//conexión entorno cloud
mongoose.connect(process.env.ATLAS_URL)
    .then(() => {
        app.listen(port, () => console.log("Servidor escuchando en el puerto", port));
    })
    .catch((error) => console.error(error));

    app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));
    app.use(bodyparser.json({limit: '50mb', extended: true}));
    
    app.use((req, res, next)=>{
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
        res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
        res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
        next();
    });

app.get('/api/', function(req, res) {
    res.json({ mensaje: '¡Hola Mundo!' })   
});

app.use('/api', usuario_routes);
app.use('/api', post_routes);
app.use('/api', pagina_routes);
app.use('/api', canal_routes);

module.exports = app;