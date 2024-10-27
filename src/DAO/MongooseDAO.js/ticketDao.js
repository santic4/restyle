import { Ticket } from '../../models/mongoose/ticketModel.js'

class TicketDao{

    async createTicket(ticketData) {
      try {
        const ticket = await Ticket.create(ticketData);
        return ticket;
      } catch (error) {
        throw new Error('Error saving ticket');
      }
    }
}

export const ticketDao = new TicketDao()