var socket = io();
var params = new URLSearchParams(window.location.search);


if (params.get('nombre') === '' || params.get('sala') === '') {
    window.location = 'index.html';
    throw new Error('El nombre es necesario');
} else {

    var usuario = {
        id: params.get('id'),
        nombre: params.get('nombre'),
        sala: params.get('sala')
    }

}

socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, function(resp) {
        console.log(resp);
    });
});

// escuchar
socket.emit('disconnect', usuario, function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/*socket.broadcast.emit('crearMensaje', {    
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});*/

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log(mensaje);

});

socket.on('listaPersonas', function(personas) {
    console.log(personas);
});

//Escuchar un mensaje privado
socket.on('mensajePrivado', function(mensaje) {
    console.log(mensaje);
})