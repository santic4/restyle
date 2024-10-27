import pkg from 'bcryptjs';
const { hashSync, compareSync } = pkg;
import jwt from "jsonwebtoken";
import { JWT_PRIVATE_KEY } from '../config/config.js';

// hash
export function hashear(frase) {
  if (!frase || typeof frase !== 'string') {
    throw new Error('Invalid data to hash. Expected a non-empty string.');
  }
  return hashSync(frase);
}

export function hasheadasSonIguales({ recibida, almacenada }) {

  if (!recibida) throw new Error('invalid data to decode')

  if (!almacenada) throw new Error('invalid data to compare')

  return compareSync(recibida, almacenada)
}

// jwt
export function encriptar(data) {
  return new Promise((resolve, reject) => {
    if (!data) {
      return reject(new Error('nothing to jwt encode!'));
    }
    jwt.sign({ url: data }, JWT_PRIVATE_KEY, { expiresIn: '1h' }, (err, encoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(encoded);
      }
    });
  });
}

export function desencriptar(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject(new Error('no token to decode!'))
    }
    jwt.verify(token, JWT_PRIVATE_KEY, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}

// TOKEN PARA MP


// Función para generar un token único
export const generateToken = () => {
  try {
    const token = hashSync(new Date().toISOString(), 10); // Genera un hash de la fecha actual
    return token;
  } catch (error) {
    throw new Error('Error al generar el token con bcryptjs: ' + error.message);
  }
};

import crypto from 'crypto';

export const encriptarFB = (data) => {
  const cipher = crypto.createCipher('aes-256-ctr', JWT_PRIVATE_KEY);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const desencriptarFB = (encrypted) => {
  const decipher = crypto.createDecipher('aes-256-ctr', JWT_PRIVATE_KEY);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
};
