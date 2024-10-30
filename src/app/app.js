import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { loggerInRequest } from '../middlewares/logger.js';
import { apiRouter } from '../routers/apiRouter.js';
import { metodosPersonalizados } from '../middlewares/respuestasMejoradas.js';
import { passportInitialize } from '../middlewares/authentication.js';
import { cookies } from '../middlewares/cookie.js';
import { sesiones } from '../middlewares/sesiones.js';
import { MONGODB, PORT } from '../config/config.js';
import { logger } from '../utils/logger.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
 import cors from 'cors'

dotenv.config()
export const app = express();

app.use(express.static(path.join('public', 'build')));

 app.use(cors({
     origin: 'https://restyle-869o.onrender.com',
     credentials: true 
 }));
 
 app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', 'https://restyle-869o.onrender.com');
     res.header('Access-Control-Allow-Credentials', 'true');
     next();
 });

 process.on('unhandledRejection', (error) => {
     console.error('Unhandled Promise Rejection:', error);
   });
   
 // Middleware de CSP
 app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data:; connect-src 'self' https://api.paypal.com https://api.mercadopago.com; font-src 'self' data:;"
    );
    next();
});


app.use(passportInitialize);

app.use(metodosPersonalizados);

// Cookies
app.use(cookies);
app.use(sesiones);

// LOGGER
app.use(loggerInRequest);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use('/api', apiRouter);

// Configura el middleware de archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/statics/photos', express.static(path.join(__dirname, '../../statics/photos')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'build', 'index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/build', 'index.html'));
});

// BASE DE DATOS
await mongoose.connect(MONGODB)

export const PUERTO = PORT || 8080;

logger.info('Conectado a DB MONGO')
// console.log(cpus())
app.listen(PUERTO, () => { logger.info(`escuchando en puerto ${PUERTO}`) })


  
