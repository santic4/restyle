import { Router } from "express"
import { appendJwtAsCookie, removeJwtFromCookies } from "../../controllers/users/authentication.js"
import { passportLogin, sessionAuth } from "../../middlewares/passport.js"
import { logoutSession, loginUser, getCurrentSessionUser } from "../../controllers/users/sessionController.js"

export const sessionRouter = Router()

// login
sessionRouter.post('/', 
    passportLogin,
    appendJwtAsCookie,
    loginUser
)

// view
sessionRouter.get('/current', 
    sessionAuth,
    getCurrentSessionUser
)

// logout
sessionRouter.delete('/current', 
    removeJwtFromCookies,
    logoutSession
)