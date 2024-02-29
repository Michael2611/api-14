const getExpeditiousCache = require('express-expeditious');

var express = require('express');
var usuarioController = require('../controllers/usuario');
var auth = require('../middlewares/auth');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir:'./uploads/portadas'});
var pathPDF = multiparty({uploadDir:'./uploads/brochures'});
var pathAvatar = multiparty({uploadDir:'./uploads/avatar'});

const cache = getExpeditiousCache({
    // Namespace used to prevent cache conflicts, must be alphanumeric
    namespace: 'expresscache',
   
    // Store cache entries for 1 minute (can also pass milliseconds e.g 60000)
    defaultTtl: '1000 milliseconds'
});

var app = express.Router();

app.post('/create_usuario', usuarioController.create_usuario);
app.post('/login_usuario', usuarioController.login_usuario);
app.get('/get_usuario/:id', auth.auth,usuarioController.get_usuario);
app.put('/update_usuario/:id', auth.auth,usuarioController.update_usuario);
app.put('/update_brochure/:id', [auth.auth, pathPDF] ,usuarioController.update_brochure);
app.put('/update_password/:id', auth.auth,usuarioController.update_password);
app.post('/validate_usuario/', usuarioController.validate_usuario);
app.get('/validate_code/:code/:email', usuarioController.validate_code);
app.post('/reset_password/:email', usuarioController.reset_password);
app.get('/obtener_usuarios_username/:username', auth.auth, usuarioController.obtener_usuarios_username);
app.post('/actualizar_portada_usuario', [auth.auth,path], usuarioController.actualizar_portada_usuario);
app.get('/obtener_portada_img/:img', usuarioController.obtener_portada_img);
app.get('/obtener_avatar_img/:img', usuarioController.obtener_avatar_img);
app.get('/obtener_brochure/:pdf', usuarioController.obtener_brochure);
app.post('/actualizar_avatar_usuario', [auth.auth,pathAvatar], usuarioController.actualizar_avatar_usuario);

app.post('/send_invitacion_amistad', auth.auth, usuarioController.send_invitacion_amistad);
app.get('/get_usuario_random', [auth.auth, cache.withTtl('1 hour')], usuarioController.get_usuarios_random);
app.get('/get_invitaciones_usuario/:tipo', auth.auth, usuarioController.get_invitaciones_usuario);
app.get('/aceptar_declinar_invitacion/:tipo/:id', auth.auth, usuarioController.aceptar_declinar_invitacion);
app.get('/obtener_usuarios/:filtro', auth.auth, usuarioController.obtener_usuarios);

app.use(cache);

module.exports = app;