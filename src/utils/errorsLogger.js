export function errorHandlerLogger(error, req, res, next) {
  if (error && error.error) {
    console.error(error.error); // Aquí estás intentando acceder a la propiedad `error` de `error`, pero `error` es `undefined`
  }
  next(error);
}