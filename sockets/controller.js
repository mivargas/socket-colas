const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
    //cuando un cliente se conecta ejecuta:
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);

    //tickets pendientes
    socket.emit('tickets-pendientes', ticketControl.tickets.length);


    socket.on('siguiente-ticket', (payload, callback) => {

        const siguiente = ticketControl.siguiete();
        callback(siguiente);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

        //Notificar que hay un nuevo ticket que asignar
    });

    socket.on('atender-ticket', ({ escritorio }, callback) => {
        if (!escritorio) {

            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket(escritorio);
        
        //notificar cambio en los ultimos 4
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        //ticket pendientes
        socket.emit('tickets-pendientes', ticketControl.tickets.length); 
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);


        if (!ticket) {
            return callback({
                ok: false,
                msg: 'No hay ticket pendientes'
            });
        } else {
            return callback({
                ok: true,
                ticket
            });
        }
    });

}



module.exports = {
    socketController
}

