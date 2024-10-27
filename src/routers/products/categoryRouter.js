import { Router } from 'express';
import { Category } from '../../models/mongoose/categories.js';
import { postCategory } from '../../controllers/products/productsController.js';
import { adminsOnly } from '../../middlewares/authorizationUserAdmin.js';
import { passportAuth } from '../../middlewares/passport.js';


export const categoryRouter = Router();

categoryRouter.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías' });
    }
});

categoryRouter.post('/', 
    passportAuth,
    adminsOnly,
    postCategory
);

categoryRouter.delete('/:cid', async (req, res) => {
    try {
        const categoryId = req.params.cid;

        const response = await Category.findByIdAndDelete(categoryId);
        
        if(!response){
            throw new Error('Ya fue eliminada.')
        }else{
            res.status(200).json({ message: 'Categoría eliminada correctamente' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar categoría' });
    }
});

