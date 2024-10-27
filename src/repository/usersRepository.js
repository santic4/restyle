import { userDao } from "../DAO/MongooseDAO.js/userDao.js"
import { AuthenticationError } from "../models/errors/authenticationError.js"
import { DataInvalid } from "../models/errors/dataInvalid.js"

class UsersRepository {

    async findUserByUsername({username}){
        try {
           
            const user = await userDao.findUserByUsername( {username} )
       
            return user

        } catch (error) {
            throw new AuthenticationError()
        }
    }

    async findById(id) {
        try {
            const user = await userDao.userById(id)

            return user
        } catch (error) {
            throw new AuthenticationError()
        }
    }

    async findAllUsers(){
        try {
            const user = await userDao.findAllUsers()

            return user
        } catch (error) {
            throw new AuthenticationError()
        }
    }

    async findOne(email) {
        try {
            return await userDao.findOne(email);
        } catch (error) {
            console.log(error, 'ERRRO DEFINITVO')
            throw new AuthenticationError()
        }
    }

    async findOnetoken(filter) {
        try {
            return await userDao.findOneToken(filter);
        } catch (error) {
            throw new AuthenticationError()
        }
    }

    async readOne(criterio) {
        try {
            const result = await userDao.readOne(criterio)

            return result
        } catch (error) {
            throw new AuthenticationError()
        }
    }

    async uploadDocuments(documents, user) {
        try {
            const response = await userDao.uploadDocuments(documents, user)

            if(!response){
                throw new DataInvalid()
            }

            return response
        } catch (error) {
            throw new DataInvalid()
        }
    }

    async changeRol(userId, newRol) {
        try {
            const result = await userDao.changeRol(userId, newRol)

            return result
        } catch (error) {
            throw new AuthenticationError()
        }
    }

    async deleteUsers(twoDaysAgo) {
        try {
            const users = await userDao.deleteUsers(twoDaysAgo)

            return users
        } catch (error) {
            throw new AuthenticationError()
        }
    }

    async deleteUserId(uid) {
        try {
            const user = await userDao.deleteUserId(uid)

            return user
        } catch (error) {
            throw new DataInvalid()
        }
    }
}

export const usersRepository = new UsersRepository()