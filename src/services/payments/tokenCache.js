import axios from 'axios';
import { PAYPALCLIENTID, PAYPALCLIENTSECRET, PAYPAL_API } from '../../config/config.js';

const TOKEN_URL = `${PAYPAL_API}v1/oauth2/token`;
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutos antes de la expiración

let accessToken = null;
let tokenExpiry = null;

async function fetchAccessToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  const response = await axios.post(TOKEN_URL, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    auth: {
      username: PAYPALCLIENTID,
      password: PAYPALCLIENTSECRET,
    },
  });

  accessToken = response.data.access_token;
  // Calcula la expiración del token basado en el tiempo actual y la duración del token (asumida a 1 hora aquí)
  tokenExpiry = Date.now() + (response.data.expires_in * 1000) - TOKEN_EXPIRY_BUFFER;
}

export async function getAccessToken() {
  if (!accessToken || Date.now() > tokenExpiry) {
    await fetchAccessToken();
  }
  return accessToken;
}