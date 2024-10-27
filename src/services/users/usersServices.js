import { hasheadasSonIguales, hashear } from '../../utils/cryptografia.js'
import { UserDTO } from '../../dto/dto.js'
import { usersRepository } from '../../repository/usersRepository.js'
import { AuthenticationError } from '../../models/errors/authenticationError.js'
import { JWT_PRIVATE_KEY } from '../../config/config.js'
import jwt from 'jsonwebtoken';
import { DataInvalid } from '../../models/errors/dataInvalid.js'

class UsersServices {

    async getCurrentUser(userData){
        const userDTO = new UserDTO(userData)
        
        return userDTO
    }

    async findUserByUsername(username, password){
        try {
      
          console.log(username,'username')
          console.log(password,'password')
            const user = await usersRepository.findUserByUsername({username})
         
            if (!user) { throw new AuthenticationError() }

            return user
        } catch (error) {
            throw new AuthenticationError()
        }
    }


    async findAllUsers(){
        try {
            const user = await usersRepository.findAllUsers()
            
            if (!user) { throw new AuthenticationError() }

            return user
        } catch (error) {
            throw new AuthenticationError()
        }
    }

    async generateResetToken(email) {

      const user = await usersRepository.findOne(email);
      console.log(user,' pase aca')

      const resetToken = jwt.sign({ email }, JWT_PRIVATE_KEY, { expiresIn: '1h' });

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hora en milisegundos

      await user.save();

      return resetToken;
    }

    async resetPassword(token, newPassword){
        try {
          const user = await usersRepository.findOnetoken({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
          });
      
          if (!user) {
            return { error: 'Token no válido o expirado' };
          }

          console.log('NEW PASS', newPassword)
          console.log(user,'useR PASSSSSSS')
      
          // Verificar que la nueva contraseña no sea igual a la anterior
          const isSamePassword = await hasheadasSonIguales({
            recibida: newPassword,
            almacenada: user.password
          });

          if (isSamePassword) {
            return { error: 'No puedes usar la misma contraseña anterior' };
          }
      
          // Restablecer la contraseña y eliminar el token
          user.password = await hashear(newPassword);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
      
          await user.save();
      
          return { message: 'Contraseña restablecida con éxito' };
        } catch (error) {
          console.error(error);
          throw new Error('Error al actualizar contraseña', error)
        }
    };

    async uploadDocuments(identificationFile, addressProofFile, bankStatementFile, user){
      try {
        if (!identificationFile || !addressProofFile || !bankStatementFile || !user) {
          throw new DataInvalid();
        }

        const documents = [
          {
            name: identificationFile.fieldname ,
            reference: identificationFile.filename 
          },
          {
            name: addressProofFile.fieldname,
            reference: addressProofFile.filename
          },
          {
            name: bankStatementFile.fieldname,
            reference: bankStatementFile.filename
          }
        ];

        const response = await usersRepository.uploadDocuments(documents, user)

        return response
      } catch (error) {
          throw new DataInvalid()
      }
  }

    async changeRol(userId, newRol) {
      if (newRol !== 'user' && newRol !== 'premium') {
        throw new Error('El rol proporcionado no es válido');
      }

      const userFound = await usersRepository.findById(userId)

      console.log(userFound,'USERFOUND')

      if (newRol === 'premium' && userFound.documents.length === 0) {
        throw new DataInvalid()
      } 

      const updatedUser = await usersRepository.changeRol(userFound._id, newRol);

      return updatedUser;
    }
    
    async deleteUsers() {
      const today = new Date();
      const twoDaysAgo = today.setDate(today.getDate() - 2);

      const days = new Date(twoDaysAgo);


      const users = await usersRepository.deleteUsers(days);

      return users;
    }

    async deleteUserId(uid) {
      if(!uid){
        throw new DataInvalid()
      }

      const users = await usersRepository.deleteUserId(uid);

      return users;
    }
}

export const usersServices = new UsersServices()