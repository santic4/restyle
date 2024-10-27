import { errorsTypes } from './errorsTypes.js'

export class AuthenticationError extends Error { // el extended es como que crea una nueva clase Error en este caso
  constructor() {
    super('error de autenticacion') // el metodo super es como invocar a la clase padre, en este caso la clase extended Error
    this.type = errorsTypes.AUTH_ERROR
  }
}