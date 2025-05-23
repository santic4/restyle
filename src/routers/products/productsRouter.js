import { Router } from 'express'
import { deleteProduct, getAllProducts, getAllProductsAdmin, getCategory, getFilteredProducts, getProductId, getProductName, postProduct, updateProduct } from '../../controllers/products/productsController.js';
import { passportAuth } from '../../middlewares/passport.js';
import { adminsOnly } from '../../middlewares/authorizationUserAdmin.js';
import { upload } from '../../middlewares/multer.js';

export const productsRouter = Router()

productsRouter.get('/', 
    getAllProducts
);

productsRouter.get('/:productName', 
  getProductName
);


// GET /products/pid
productsRouter.get('/id/:pid', 
    getProductId
)

// POST /products/
const handleUpload = upload.fields([
  { name: 'images', maxCount: 20 }
]);

productsRouter.post('/',
  passportAuth,
  adminsOnly,
  handleUpload,
  postProduct
);

// PUT /products/:pid
productsRouter.put('/:pid', 
  passportAuth,
  adminsOnly,
  handleUpload,
  updateProduct
)

// DEL /products/:pid
productsRouter.delete('/:pid', 
    passportAuth,
    adminsOnly,
    deleteProduct
)
