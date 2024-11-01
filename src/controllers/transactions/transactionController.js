import Transaction from '../../models/mongoose/transactionSchema.js';
import { findTransactionGetAll } from "../../services/transactions/transactionServicesMP.js"

export const transactions = async (req, res, next) => {
  try{

    const updProduct = await findTransactionGetAll();

    res.json(updProduct)

  }catch(err){
      next(err)
  }
}

  export const deleteTransaction = async (req, res, next) => {
    const { id } = req.query; 
  
    if (!id) {
      return res.status(400).json({ message: 'ID de transacción es requerido' });
    }
  
    try {
      const deletedTransaction = await Transaction.findByIdAndDelete(id); 
  
      if (!deletedTransaction) {
        return res.status(404).json({ message: 'Transacción no encontrada' });
      }
  
      return res.status(200).json({ message: 'Transacción eliminada correctamente' });
    } catch (error) {
      console.error(error);
      next(error)
    }
  };
  