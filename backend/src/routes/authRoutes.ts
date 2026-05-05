import { Router } from 'express';
import { 
  register, 
  login, 
  resetPassword, 
  logout,
  changePassword,
  getMe
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/change-password', changePassword);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;