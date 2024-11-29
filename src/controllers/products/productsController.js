import { bucket } from "../../config/firebase-config.js";
import { Category } from "../../models/mongoose/categories.js";
import { Product } from "../../models/mongoose/productModel.js";
import { productServices } from "../../services/products/productServices.js";

export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, subcategory, colors, sort } = req.query;

    // Normalización de categorías y subcategorías
    const normalizedCategory = category ? category.replace(/-/g, ' ').toUpperCase() : null;
    const normalizedSubcategory = subcategory ? subcategory.replace(/-/g, ' ').toUpperCase() : null;

    // Construcción de filtros dinámicos
    const filters = {};
    if (normalizedCategory) {
      filters.category = { $regex: normalizedCategory, $options: 'i' };
    }
    if (normalizedSubcategory) {
      filters.subcategory = { $regex: normalizedSubcategory, $options: 'i' };
    }
    if (colors) {
      filters.colors = { $in: colors.split(',') };
    }

    // Construcción de opciones de orden
    let sortOption = { posicion: 1 }; // Por defecto, ordenar por posición
    if (sort === 'Menor a mayor precio') {
      sortOption = {  price: 1, posicion: 1};
    } else if (sort === 'Mayor a menor precio') {
      sortOption = { price: -1, posicion: 1 };
    }

    // Opciones de paginación
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortOption,
    };

    // Consulta para productos con posición
    const withPosition = await Product.paginate({ ...filters, posicion: { $ne: null } }, options);

    // Consulta para productos sin posición
    const withoutPosition = await Product.find({ ...filters, posicion: null })
      .lean()
      .sort({ createdAt: -1 }); // Productos sin posición se ordenan por fecha de creación

    // Mezclar productos sin posición aleatoriamente
    withoutPosition.sort(() => Math.random() - 0.5);

    // Combinar resultados
    const combinedResults = [...withPosition.docs, ...withoutPosition.slice(0, limit - withPosition.docs.length)];

    // Calcular total y páginas
    const totalDocs = withPosition.totalDocs + withoutPosition.length;
    const totalPages = Math.ceil(totalDocs / limit);

    // Respuesta final
    res.status(200).json({
      docs: combinedResults,
      totalDocs,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
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

    // Subir imágenes a Firebase Storage
    for (const file of imageFiles) {
      const fileUpload = bucket.file(`images/${file.originalname}`);
      await fileUpload.save(file.buffer, { contentType: file.mimetype });
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`;
      imageUrls.push(imageUrl);
    }
    
    // Guardar las URLs en el objeto newData
    newData.images = imageUrls;

    const newProduct = await productServices.postProduct(req.user, newData);

    res.json(newProduct);
  } catch (error) {

    next(error);
  }
};


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



export const deleteProduct = async (req, res, next) => {
  try{
    const idProduct = await productServices.deleteProduct(req.params.pid, req.user.url._id)

    res.json(idProduct)

  }catch(err){
      next(err)
  }
}
