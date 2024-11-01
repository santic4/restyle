import { usersServices } from '../../services/users/usersServices.js'
import { encriptar, hasheadasSonIguales } from "../../utils/cryptografia.js"

const COOKIE_OPTS = { signed: true, maxAge: 1000 * 60 * 60, httpOnly: true }

export async function loginUser(username, password, done) {
  try {
  
    const user = await usersServices.findUserByUsername(username, password);

    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

  
    const isMatch = hasheadasSonIguales({ recibida: password, almacenada: user.password });

    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }
  
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}

// COOKIES
export async function appendJwtAsCookie(req, res, next) {
  try {
  
    const jwt = await encriptar(req.user);

    res.cookie('authorization', jwt, COOKIE_OPTS);
    
    next();
  } catch (error) {
    console.log('ERROR', error);
    next(error);
  }
}

export async function removeJwtFromCookies(req, res, next) {
  try {
    res.clearCookie('authorization'); 
    next();
  } catch (error) {
    console.log('ERROR', error);
    next(error);
  }
}

export async function jwtAuthentication(user, done) {
  done(null, user);
}