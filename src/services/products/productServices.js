import { PermissionsError } from "../../models/errors/permissionsError.js";
import { productRepository } from "../../repository/productRepository.js";
import { usersRepository } from "../../repository/usersRepository.js";
import { NotFoundError } from '../../models/errors/notFoundError.js'
import { emailService } from "../email/emailServices.js";
import { DataInvalid } from "../../models/errors/dataInvalid.js";
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { bucket } from "../../config/firebase-config.js";

// Definir __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define la ruta a la carpeta de fotos
const photosDirectory = path.join(__dirname, '../../../statics/photos');

class ProductServices{
    async getAllProducts(filter, options){
        
        const paginado = await productRepository.getAllProducts(filter, options)

        const results = {
            status: 'success',
            payload: paginado.docs,
            totalPages: paginado.totalPages,
            prevPage: paginado.prevPage,
            nextPage: paginado.nextPage,
            page: paginado.page,
            hasPrevPage: paginado.hasPrevPage,
            hasNextPage: paginado.hasNextPage,
        };

        return results
    }
    
    async getProductByName (productName) {
        const product = await productRepository.findProductByName(productName);
        if (!product) {
          throw new Error('Producto no encontrado');
        }
        return product;
    };
      

    async postProduct(user ,newData){
        if (newData.price < 0) {
            throw new Error('El precio del producto no puede ser negativo.');
        }
     
        if (user.url.rol !== 'admin') {
            throw new PermissionsError();
        }

        const newProduct = await productRepository.postProduct(newData)

        return newProduct
    }


    async getAllProductsAdmin(){
        
        const productAdmin = await productRepository.getAllProductsAdmin()

        return productAdmin
    }

    async getCategory(category){
        if(!category){
            throw new DataInvalid()
        }
        const categoryProducts = await productRepository.getCategory(category);


        return categoryProducts
    }

    async getProductId(pid){
   
        const product = await productRepository.getProductId(pid)
   
        if(!product){
            throw new NotFoundError()
        }

        return product
    }
    

    async updateProduct(pid, newData, files){

        const product = await productRepository.getProductId(pid);

        if (!product) {
            throw new NotFoundError();
        }

        if (typeof newData.productData === 'string') {
            newData.productData = JSON.parse(newData.productData);
        }

        if(files.images){
            const imageFiles = files.images || [];

            const imageUrls = [];
    
            // Subir imágenes a Firebase Storage
            for (const file of imageFiles) {
              const fileUpload = bucket.file(`images/${file.originalname}`);
              await fileUpload.save(file.buffer, { contentType: file.mimetype });
              const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`;
              imageUrls.push(imageUrl);
            }
    
            const updatedImageUrls = [...(product.images || []), ...imageUrls];
    
            newData.productData.images = updatedImageUrls;
        }

        if (typeof newData.productData === 'string') {
            newData.productData = JSON.parse(newData.productData);
        }

        const updProduct = await productRepository.updateProduct(pid, newData.productData)

        if (!updProduct) {
            throw new Error(`El producto con id ${pid} no se encontró`);
        }

        return updProduct
    }

    async deleteProduct(pid, userId) {
        // Encuentra al usuario
        const Usuario = await usersRepository.findById(userId);
    
        if (!Usuario) {
            throw new Error('Usuario no encontrado');
        }
    
        // Verifica permisos del usuario
        if (Usuario.rol !== 'admin') {
            throw new Error('No tienes permisos para modificar productos');
        }
    
        // Encuentra el producto por ID
        const product = await productRepository.getProductId(pid);
        console.log(product, 'product en deleteProduct');
    
        if (!product) {
            throw new Error('Producto no encontrado');
        }
    
        console.log(`Ruta a la carpeta de fotos: ${photosDirectory}`);
    
    
        // Elimina el producto de la base de datos
        const delProducto = await productRepository.deleteProduct(pid);
    
        if (product.images && product.images.length > 0) {
            for (const imageUrl of product.images) {
                // Extraer el nombre del archivo de la URL
                const fileName = decodeURIComponent(imageUrl.split('/o/')[1].split('?')[0]);
          
                const file = bucket.file(`${fileName}`);
                await file.delete();
            }
        }

        // Envía notificación si es necesario
        if (delProducto && Usuario.rol === 'premium') {
            await emailService.send(
                Usuario.email,
                'Producto eliminado',
                `El producto eliminado fue ${product.title}`
            );
        }
    
        return delProducto;
    }
}

export const productServices = new ProductServices()