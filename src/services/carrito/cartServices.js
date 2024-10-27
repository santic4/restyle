// services/cartService.js
import { cartDao } from '../../DAO/MongooseDAO.js/cartDao.js';
import { productServices } from '../products/productServices.js';

class CartServices {

  async createCartService(cid){
    const cart = await cartDao.createCartDAO();
    return cart
  };

  async getCartByIdService(cartId){
    const cart = await cartDao.getCartId(cartId);
    return cart
  };

  async addProductToCartService(cartId, productId, quantity, color, tails){

    const product = await productServices.getProductId(productId);

    if (!product) throw new Error('Producto no encontrado');

    const response = await cartDao.addProductToCartDAO(cartId, product, quantity, color, tails);
    return response
  };

  async removeProductFromCartService(cartId, productId){
    const response = await cartDao.removeProductFromCartDAO(cartId, productId);
    return response
  };

  async clearCartService(cartId){
    const response = await cartDao.clearCartDAO(cartId);
    return response
  };

}

export const cartServices = new CartServices()