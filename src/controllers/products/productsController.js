import { bucket } from "../../config/firebase-config.js";
import { Category } from "../../models/mongoose/categories.js";
import { Product } from "../../models/mongoose/productModel.js";
import { productServices } from "../../services/products/productServices.js";
import { logger } from "../../utils/logger.js";

export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, colors, sort } = req.query;

    // Filtros dinámicos
    let filters = {};
    if (category) {
      filters.category = category;
    }
    if (colors) {
      filters.colors = { $in: colors.split(',') }; 
    }

    // Opciones de orden
    let sortOption = {};
    if (sort === 'Menor a mayor precio') {
      sortOption.price = 1; // Ascendente
    } else if (sort === 'Mayor a menor precio') {
      sortOption.price = -1; // Descendente
    }

    // Paginar los resultados
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortOption,
    };

    const result = await Product.paginate(filters, options);

    res.status(200).json(result); 
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
};

export const getProductName = async (req, res) => {
  const { productName } = req.params;
  try {

    const product = await productServices.getProductByName(productName);

    res.json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const postProduct = async (req, res, next) => {
  try {
    const newData = req.body;
    const { files } = req;

    const imageFiles = files.images || [];

    const imageUrls = [];

    console.log(newData,'newdata', files,'files')
    // Subir imágenes a Firebase Storage
    for (const file of imageFiles) {
      const fileUpload = bucket.file(`images/${file.originalname}`);
      await fileUpload.save(file.buffer, { contentType: file.mimetype });
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`;
      imageUrls.push(imageUrl);
    }
    
    // Guardar las URLs en el objeto newData
    newData.images = imageUrls;

    console.log(newData,'newdata2', req.user,'req.user')
    const newProduct = await productServices.postProduct(req.user, newData);

    res.json(newProduct);
  } catch (error) {

    next(error);
  }
};

export const getAllProductsAdmin = async (req, res, next) => {
    try {

        const productAdmin = await productServices.getAllProductsAdmin();

        res.json(productAdmin);
      } catch (error) {
        next(error)
      }
}

export const getCategory = async (req, res, next) => {
    try{

     const { category } = req.query;
     
  
     const categoryProducts = await productServices.getCategory(category);
  
     const results = {
      status: 'success',
      payload: categoryProducts,
    };

     res.json(results)
 
    }catch(err){
     next(err)
    }
}

export const postCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
    }

    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json({ message: 'Categoría agregada' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'La categoría ya existe' });
    }
    next(error);
  }
};

export const getFilteredProducts = async (req, res) => {
  const { name, minPrice, maxPrice } = req.query;
  
  const query = {};

  if (name) {
    query.title = new RegExp(name, 'i'); 
    
}

  if (minPrice && maxPrice) {
      query.price = { $gte: minPrice, $lte: maxPrice };
  } else if (minPrice) {
      query.price = { $gte: minPrice };
  } else if (maxPrice) {
      query.price = { $lte: maxPrice };
  }

  try {
      const products = await Product.find(query);
      res.status(200).json(products);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


export const getProductId = async (req, res, next) => {
    try{
     const product = await productServices.getProductId(req.params.pid);
 
     res.json(product)
 
    }catch(err){
     next(err)
    }
}

export const check = async (req, res, next) => {
  try {
    
    const file = req.file
     res.json(file)

  } catch (error) {

     next(error)
  }
}



// 

export const updateProduct = async (req, res, next) => {
  try{
    
    const { files } = req;

    const updProduct = await productServices.updateProduct(req.params.pid, req.body, files)
  
    res.json(updProduct)

  }catch(err){
      next(err)
  }
}

export const deleteProduct = async (req, res, next) => {
  try{
    const idProduct = await productServices.deleteProduct(req.params.pid, req.user.url._id)

    res.json(idProduct)

  }catch(err){
      next(err)
  }
}
