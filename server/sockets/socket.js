const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios;

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {
        if (!data.nombre ||  !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre es necesario'
            });
        }

        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasSala(data.sala));

        callback(usuarios.getPersonasSala(data.sala));
    });

    client.on('disconnect', () => {


        let usuarioBorrado = usuarios.borrarPersona(client.id);

        if (!usuarioBorrado) {
            return {
                error: true,
                mensaje: 'NO se ha eliminado el usuario de la bbdd'
            };
        } else {
            client.emit('crearMensaje', crearMensaje('Administrador', `${ usuarioBorrado.nombre } Salió del chat`))
            client.broadcast.to(usuarioBorrado.sala).emit('listaPersonas', usuarios.getPersonasSala(usuarioBorrado.sala));
        }

    });

    client.on('crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(persona.sala).emit('crearMensaje', crearMensaje(persona.nombre, data.mensaje));

    });

    client.on('mensajePrivado', (data) => {

        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    })

});