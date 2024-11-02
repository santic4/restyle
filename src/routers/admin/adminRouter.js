import { Router } from 'express'
import { getAllProductsAdmin } from '../../controllers/products/productsController.js';
import { passportAuth } from '../../middlewares/passport.js';
import { adminsOnly } from '../../middlewares/authorizationUserAdmin.js';
import { FeaturedProducts } from '../../models/mongoose/featuredModel.js';

export const adminRouter = Router()

adminRouter.get('/administrador', 
    passportAuth,
    adminsOnly,
    getAllProductsAdmin
);

adminRouter.get('/featured-products', async (req, res) => {
  try {
    const products = await FeaturedProducts.find({});
    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

adminRouter.post('/featured-products', async (req, res) => {
  try {
    const body = req.body
    
    const schema = {
      _id:body._id,
      title: body.title,
      price: body.price,
      category: body.category,
      images: body.images
    }

    const newProduct = await FeaturedProducts.create(schema);

    await newProduct;
    res.json(newProduct);
  } catch (error) {
    res.status(500).send(error);
  }
});

adminRouter.delete('/featured-products/:id', async (req, res) => {
  try {
    await FeaturedProducts.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(error);
  }
});
  