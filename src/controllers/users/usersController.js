import { usersManager } from "../../models/index.js";
import { usersServices } from "../../services/users/usersServices.js";
import bcrypt from 'crypto';
import { hashear } from "../../utils/cryptografia.js";
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await usersServices.getCurrentUser(req.user)

    res.successfullGet(user)

  } catch (error) {
      req.logger.error('Error al obtener información del usuario:'+ error.message);
      next(error);
  }
};

export const postUser = async (req, res, next) => {
  try {
    let body = req.body;
    const password = req.body.password;
        // 2. Hashear la contraseña antes de almacenarla
        const saltRounds = 10; // Número de rondas de salt, a más alto más seguro pero más lento
        const hashedPassword = await hashear(password)

        body.password = hashedPassword
    const user = await usersManager.create(body)

    await user.save()

  } catch (error) {
      req.logger.error('Error al obtener información del usuario:'+ error.message);
      next(error);
  }
};
