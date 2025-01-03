import { Router } from 'express'
import { errorHandlerLogger } from '../utils/errorsLogger.js'
import { errorHandler } from '../middlewares/errorHandler.js'
import { metodosPersonalizados } from '../middlewares/respuestasMejoradas.js'
import { usersRouter } from './users/usersRouter.js'
import { sessionRouter } from './users/sessionRouter.js'
import { carritoRouter } from './carrito/carritoRouter.js'
import { productsRouter } from './products/productsRouter.js'
import { MercadoPagoRouter } from './paymentsRouter/mercadoPagoRouter.js'
import { CardsPay } from './paymentsRouter/cardsPay.js'
import { adminRouter } from './admin/adminRouter.js'
import { TransactionRouter } from './transactions/transactions.js'

export const apiRouter = Router()

apiRouter.use(metodosPersonalizados)

// END POINTS
apiRouter.use('/usuarios', usersRouter)
apiRouter.use('/session', sessionRouter)
apiRouter.use('/productos', productsRouter)
apiRouter.use('/admin', adminRouter)
apiRouter.use('/carrito', carritoRouter)
apiRouter.use('/mercado-pago', MercadoPagoRouter)
apiRouter.use('/tarjetas', CardsPay)
apiRouter.use('/transactions', TransactionRouter)




// MIDDLEWARES

apiRouter.use(errorHandlerLogger)
apiRouter.use(errorHandler)
