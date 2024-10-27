export class TransactionDTO {
    constructor(trans) {
      this.id = trans._id;
      this.cart = trans.carrito;
      this.status = trans.status;
      this.email = trans.emailSend;
      this.clientData = trans.clientData
      this.carrito = trans.carrito
      this.total = trans.total
      this.createdAt = trans.createdAt
    }
}

export default TransactionDTO;