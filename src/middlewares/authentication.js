import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { JWT_PRIVATE_KEY } from '../config/config.js'
import { jwtAuthentication, loginUser} from '../controllers/users/authentication.js'

passport.use('localLogin', new LocalStrategy(
  loginUser
 )
)

passport.use('jwtAuth', new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromExtractors([function (req) {

    let token = null
    if (req?.signedCookies) {
      token = req.signedCookies['authorization']
    }

    return token
  }]),
  secretOrKey: JWT_PRIVATE_KEY
}, jwtAuthentication));


passport.serializeUser((user, next) => { next(null, user) })
passport.deserializeUser((user, next) => { next(null, user) })

export const passportInitialize = passport.initialize()
export const passportSession = passport.session()
