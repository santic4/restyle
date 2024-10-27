import { Router} from 'express'
import { clearCart, removeProductFromCart, addProductToCart, getCartById, createCart,} from '../../controllers/carrito/cartController.js'
export const carritoRouter = Router()

// Crear un nuevo carrito
carritoRouter.post('/', createCart);

// Obtener un carrito por ID
carritoRouter.get('/:cartId', getCartById);

// Agregar un producto al carrito
carritoRouter.post('/:cartId/producto', addProductToCart);

// Eliminar un producto del carrito
carritoRouter.delete('/:cartId/producto/:productId', removeProductFromCart);

// Limpiar el carrito
carritoRouter.delete('/:cartId', clearCart);