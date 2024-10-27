import { cartDao } from '../DAO/MongooseDAO.js/cartDao.js'
import { NotFoundError } from '../models/errors/notFoundError.js'

class CartRepository {

    async getCartId(cid){
        const cartID = await cartDao.getCartId(cid)

        return cartID
    }

    async postCart(user){
      
        const newCart = await cartDao.postCart(user)

        if(!newCart){
            throw new NotFoundError()
        }

        return newCart
    }

    async updateQuantityProductInCart(cid, pid, cantidadNumerica){
        const cartUpd = await cartDao.updateQuantityProductInCart(cid, pid, cantidadNumerica);

        return cartUpd
    }

    async postProductIntoCart(cid, pid, productExist){
        const cartUpd = await cartDao.postProductIntoCart(cid, pid, productExist)

        return cartUpd
    }

    async deleteCart(idCart){
        const cartDeleted = await cartDao.deleteCart(idCart)

        return cartDeleted
    }

    async deleteProdInCart(cid, pid){
        const deleteProd = await cartDao.deleteProdInCart(cid, pid);

        return deleteProd
    }

}

export const cartRepository = new CartRepository()
