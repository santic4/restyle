import { errorsTypes } from './errorsTypes.js';

export class NotFoundError extends Error {
  constructor(message = 'Recurso no encontrado') {
    super(message);
    this.type = errorsTypes.NOT_FOUND_ERROR;
  }
}