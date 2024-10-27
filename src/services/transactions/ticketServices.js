import { ticketDao } from '../../DAO/MongooseDAO.js/ticketDao.js'

class TicketService {
  async generateTicket(code, purchaseDatetime, amount, purchaser) {
    try {
      const ticketData = {
        code,
        purchase_datetime: purchaseDatetime,
        amount,
        purchaser,
      };
      const newTicket = await ticketDao.createTicket(ticketData)

      return newTicket;

    } catch (error) {
      throw new Error('Error generating ticket');
    }
  }
}

export const ticketServices = new TicketService()