import { errorsTypes } from "./errorsTypes.js";

export class PermissionsError extends Error {
    constructor(message = 'Insufficient permissions') {
      super(message);
      this.name = 'PermissionsError';
      // this.statusCode = 403;
      this.type = errorsTypes.PERM_ERROR
    }
  }