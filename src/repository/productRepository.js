import { productDao } from "../DAO/MongooseDAO.js/productDao.js"
import { DataInvalid } from '../models/errors/dataInvalid.js'

class ProductRepository{
    async getAllProducts(filter, options){
        try {
            const paginado = await productDao.getAllProducts(filter, options)

            return paginado

        } catch (error) {
            throw new Error('Error en filtros')
        }
    }

    async findProductByName (productName) {
        try {
            const response = await productDao.getProductName(productName)

            return response

        } catch (error) {
            throw new Error('Error en filtros')
        }
      };

    async postProduct(newData){
        try {
            const newProduct = await productDao.postProduct( newData)

            return newProduct
        } catch (error) {
            console.error(error.message)
            throw new DataInvalid()
        }
    }


    async getAllProductsAdmin(){
        try {
            const productAdmin = await productDao.getAllProductsAdmin();

            return productAdmin

        } catch (error) {
            throw new Error('Error en filtros')
        }
    }

    async getCategory(category){
        const categoryProducts = await productDao.getCategory(category);

        return categoryProducts
    }

    async getProductId(pid){
        try {
            const product = await productDao.getProductId(pid)

            return product  
        } catch (error) {
            throw new Error('Producto no encontrado')
        }
    };


    async updateProduct(pid, newData){
        try {
   
            const updProduct = await productDao.updateProduct(pid, newData)

            return updProduct
        } catch (error) {
            console.log(error.message)
            throw new Error(`Error al actualizar el producto por ID: ${error.message}`);
        }
    }

    async deleteProduct(pid) {
        try {
            const updProduct = await productDao.deleteProduct(pid)

            return updProduct
        } catch (error) {
            throw new Error('Producto no encontrado')
        }
    }
}

export const productRepository = new ProductRepository()