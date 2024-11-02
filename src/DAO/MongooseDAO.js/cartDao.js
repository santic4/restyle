// repositories/cartRepository.js
import Cart from '../../models/mongoose/cartModel.js'
import mongoose from 'mongoose';

class CartDao {

  async createCartDAO(cid){
    const newCart = new Cart({
      items: [],
      totalPrice: 0,
      createdAt: Date.now(),
    });
    return await newCart.save();
  };

  async getCartId(cid){
    try{

      const idCarritoSelec = await Cart.findById(cid)
        .populate('items.productID');
      

      return idCarritoSelec
    }catch(error){
      throw new Error(`Error al obtener el carrito por ID: ${error.message}`);
    }
  }

  async addProductToCartDAO(cartId, product, quantity, color, tail){
 
    const cart = await Cart.findById(cartId);

    const existingProductIndex = cart?.items.findIndex(item => item.productID.equals(product._id));

    if (existingProductIndex !== -1) {
      cart.items[existingProductIndex].quantity += quantity;
    } else {
      cart?.items.push({ productID: product._id, quantity, price: product.price, colorSelected: color, tailSelected: tail });
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

    return await cart?.save();
  };

  async removeProductFromCartDAO(cartId, productId) {
    const cart = await Cart.findById(cartId);
    
    // Buscar el índice del producto en el carrito
    const productIndex = cart.items.findIndex(item => item.productID.equals(productId));

    if (productIndex !== -1) {
        // Reducir la cantidad en 1
        cart.items[productIndex].quantity -= 1;

        // Si la cantidad llega a 0, eliminar el producto
        if (cart.items[productIndex].quantity <= 0) {
            cart.items.splice(productIndex, 1); // Elimina el producto del array
        }
    }

    // Actualizar el total del carrito
    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
    
    return await cart.save();
  }


  async clearCartDAO(cartId){
    const cart = await Cart.findById(cartId);
    cart.items = [];
    cart.totalPrice = 0;
    return await cart.save();
  };
}

export const cartDao = new CartDao()