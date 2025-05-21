import express from 'express';
import {ForgotPasswordRequest, ForgotPasswordReset, ForgotPasswordVerifyOtp, GetUser, Login, Register, ResendOtp, VerifyUser } from '../controllers/User.Controller.js';
import isAuthenticated from '../middlewares/isAuth.Middleware.js';

const router = express.Router();

// route handlers
router.route("/register").post(Register)
router.route("/login").post(Login)
router.route("/logout").get((req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
});

router.route("/me").get(isAuthenticated, GetUser);
router.route("/verify-otp").post(VerifyUser)
router.route("/resend-otp").post(ResendOtp)
router.post('/forgot-password/request', ForgotPasswordRequest);
router.post('/forgot-password/verify', ForgotPasswordVerifyOtp);
router.post('/forgot-password/reset', ForgotPasswordReset);


export default router;