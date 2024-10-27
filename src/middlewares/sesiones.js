import session from 'express-session';
import connectMongo from 'connect-mongo';
import { MONGODB, SESSION_SECRET } from '../config/config.js';

const store = connectMongo.create({
  mongoUrl: MONGODB,
  ttl: 60 * 60 * 24,
});

export const sesiones = session({
  store,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    signed: true, 
    sameSite: 'none', 
    maxAge: 60 * 60 * 24 * 1000
  }
});