import { errorsTypes } from "./errorsTypes.js";

export class DataInvalid extends Error {
    constructor(message = 'Invalid data') {
      super(message);
      this.type = errorsTypes.DATA_INVALID;
    }
  }