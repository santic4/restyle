import { Product } from '../../models/mongoose/productModel.js'
import { randomUUID } from 'crypto'
import { logger } from '../../utils/logger.js';

class ProductDao{
    async getAllProducts(filter, options) {
        try {

        if (options.sort.priceARS) {
            return await Product.paginate(filter, options);
        }

          // Filtrar por aquellos productos que tienen `position` definido
          const productosConPosition = await Product.paginate(
            { ...filter, position: { $ne: null } }, 
            { ...options, sort: { position: 1, _id: 1 } }
          );
      
          // Si no hay productos con `position`, devolver productos sin `position`
          if (!productosConPosition.totalDocs) {
            const productosSinPosition = await Product.paginate(
              filter, 
              { ...options, sort: { _id: 1 } }
            );

            return productosSinPosition;
          }
      
          return productosConPosition;
        } catch (error) {
          console.error('Error en getAllProducts DAO:', error);
          throw error;
        }
      }  

      async getProductName(productName) {

        return await Product.findOne({ title: productName });
      }

    async postProduct(userId, newData){

      
        newData.owner = userId;

        let inserted = false;
        let newProduct;
        while (!inserted) {
            try {
                newData._id = randomUUID(); 

                newProduct = await Product.create(newData);

                inserted = true; 
            } catch (error) {
                if (error.code === 11000) {
                    logger.info('Se entro en error por duplicacion')
                } else {
                    logger.info('Se entro algun otro error que no es codigo duplicacion')
                    console.error(error)
                    throw new Error('error code')
                }
            }
        }

        return newProduct
    }

    async getAllProductsAdmin(){
        console.log('dao')
        const productAdmin = await Product.find({}).lean();
        console.log('despuets',productAdmin)
        return productAdmin

    }

    async getCategory(category){
        const categoriasProductos = await Product.find({ category: category });

        return categoriasProductos;
    }

    async getProductId(pid){

        const productoPorId = await Product.findById(pid);

        return productoPorId;
    
    }



    async updateProduct(pid, newData){
        const updProduct = await Product.findByIdAndUpdate(
            pid,
            { $set: newData },
            { new: true }
        );

        return updProduct
    }

    async deleteProduct(pid){
        const delProduct = await Product.findByIdAndDelete(pid);

        return delProduct
    }
}

export const productDao = new ProductDao()