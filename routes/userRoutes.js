import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';


// Public Routes
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)
router.post('/update-user', UserController.updateUserDetails)
router.post('/reset-password', UserController.resetPassword)


export default router