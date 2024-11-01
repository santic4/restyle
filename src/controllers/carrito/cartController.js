// controllers/cartController.js
import { cartServices } from '../../services/carrito/cartServices.js'

export const createCart = async (req, res, next) => {
  try {
    const cart = await cartServices.createCartService();

    res.status(201).json(cart);

  } catch (error) {
    next(error)
  }
};

export const getCartById = async (req, res, next) => {
  const cartID = req.params.cartId;

  try {
    const cart = await cartServices.getCartByIdService(cartID);

    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    res.status(200).json(cart);
  } catch (error) {
    next(error)  }
};

export const addProductToCart = async (req, res, next) => {
  const cartID = req.params.cartId
  const productID = req.body.productID
  const quantity = req.body.quantity
  const color = req.body.colorSelected  
  const tails = req.body.tailSelected
  try {
    const updatedCart = await cartServices.addProductToCartService(cartID, productID, quantity, color, tails);

    res.status(200).json(updatedCart);
  } catch (error) {
    next(error)
  }
};

export const removeProductFromCart = async (req, res, next) => {
  const cartID = req.params.cartId
  const productID = req.params.productId
  
  try {
    const updatedCart = await cartServices.removeProductFromCartService(cartID, productID);
    
    res.status(200).json(updatedCart);

  } catch (error) {
    next(error)
  }
};

export const clearCart = async (req, res, next) => {
  const cartID = req.params.cartId;
  
  try {
    await cartServices.clearCartService(cartID);
    res.status(200).json({ message: 'Carrito limpiado correctamente' });
  } catch (error) {
    next(error)
  }
};
