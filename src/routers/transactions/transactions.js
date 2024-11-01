import { Router } from 'express'
import { passportAuth } from '../../middlewares/passport.js';
import { adminsOnly } from '../../middlewares/authorizationUserAdmin.js';
import { deleteTransaction, transactions } from '../../controllers/transactions/transactionController.js';

export const TransactionRouter = Router();

TransactionRouter.get('/', 
    passportAuth,
    adminsOnly,
    transactions
);

TransactionRouter.delete('/', 
    passportAuth,
    adminsOnly,
    deleteTransaction
);