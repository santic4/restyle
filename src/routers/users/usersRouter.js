import { Router } from 'express'

//controllers
import { getCurrentUser, postUser } from '../../controllers/users/usersController.js'

// passport
import { passportAuth } from '../../middlewares/passport.js'
import { adminsOnly } from '../../middlewares/authorizationUserAdmin.js'


export const usersRouter = Router()

usersRouter.get('/current', 
    passportAuth,
    adminsOnly,
    getCurrentUser
)

usersRouter.post('/',
    postUser
)