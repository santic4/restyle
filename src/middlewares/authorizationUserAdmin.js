import { authorizeAdmin } from '../controllers/users/authorizationUserAdmin.js'

export const adminsOnly = authorizeAdmin;
