import { Router, Request, Response, NextFunction } from "express";
import {
  register,
  login,
  resetPassword,
  logout,
  changePassword,
  getMe,
  updateProfile,
  uploadPhoto,
  updatePassword,
  googleLogin,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { uploadPhoto as uploadMiddleware } from "../middleware/upload";
import {
  validateRegister,
  validateLogin,
  validateResetPassword,
  validateChangePassword,
  validateUpdateProfile,
  validateUpdatePassword,
} from "../middleware/validate";

const router = Router();

// Wrapper to catch async errors and forward to global error handler
const wrap = <Req extends Request>(fn: (req: Req, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req as Req, res, next).catch(next);
  };

router.post("/register", validateRegister, wrap(register));
router.post("/login", validateLogin, wrap(login));
router.post("/google", wrap(googleLogin));
router.post("/verify-email", wrap(verifyEmail));
router.post("/resend-verification", wrap(resendVerificationEmail));
router.post("/reset-password", validateResetPassword, wrap(resetPassword));
router.post("/change-password", validateChangePassword, wrap(changePassword));
router.post("/logout", authenticate, wrap(logout));
router.get("/me", authenticate, wrap(getMe));
router.put("/profile", authenticate, validateUpdateProfile, wrap(updateProfile));
router.put("/password", authenticate, validateUpdatePassword, wrap(updatePassword));
router.post("/photo", authenticate, uploadMiddleware, wrap(uploadPhoto));

export default router;
