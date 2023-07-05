const fs = require('fs');
const path = require('path');
const Ticket = require('./ticket');

class ticketControl {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = []
         
        //inicializar metodo
        this.init()
    }

    get toJson() {
        return {

            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,

        }
    }


    init() {
        const { hoy, tickets, ultimo, ultimos4 } = require('../db/data.json');
        //console.log(data);
        if (hoy === this.hoy) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;

        } else {
            //es otro dia (no hoy)
            this.guardarDB();
        }
    }

    guardarDB() {
        const dbPath = path.join(__dirname, '../db/data.json')
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    siguiete(){
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);
        
        this.guardarDB();

        return `Ticket ${ticket.numero}`
    }

    atenderTicket(escritorio){
        if (this.tickets.length === 0) {
            return null;
        }
        const ticket = this.tickets.shift(); //this.tickets[0]

        ticket.escritorio = escritorio;

        this.ultimos4.unshift( ticket );

        if (this.ultimos4 > 4) {
            this.ultimos4.pop();
        }
        this.guardarDB();

        return ticket;
    }
}

module.exports = ticketControl;