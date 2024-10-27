import dotenv from 'dotenv'

dotenv.config()

// LOCAL
export const PORT=process.env.PORT

// HOST
export const HOST=process.env.HOST

// NODE
export const NODE_ENV = process.env.NODE_ENV

// DB
export const MONGODB = process.env.MONGODB

// SECRETS WORDS
export const COOKIE_SECRET = process.env.COOKIE_SECRET
export const SESSION_SECRET = process.env.SESSION_SECRET
export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY

// Email Services
export const EMAIL_USER = process.env.EMAIL_USER
export const EMAIL_PASS = process.env.EMAIL_PASS

// Stripe
export const STRIPE_KEY_P = process.env.STRIPE_KEY_P

// config.js
export const PAYPALCLIENTID = process.env.PAYPALCLIENTID
export const PAYPALCLIENTSECRET = process.env.PAYPALCLIENTSECRET
export const PAYPAL_API = process.env.PAYPAL_API

// MP ACCESS_TOKEN_MP
export const ACCESS_TOKEN_MP = process.env.ACCESS_TOKEN_MP

export const projectId = process.env.FIREBASE_PROJECT_ID;
export const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
export const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');