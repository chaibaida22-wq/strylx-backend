import express from "express";

import authController from "../controllers/auth.controller.js";

const router = express.Router();


// =====================================================
// REGISTER
// =====================================================

router.post(
    "/register",
    authController.register
);


// =====================================================
// LOGIN
// =====================================================

router.post(
    "/login",
    authController.login
);


// =====================================================
// VERIFY EMAIL
// =====================================================

router.get(
    "/verify-email/:token",
    authController.verifyEmail
);


// =====================================================
// RESEND VERIFICATION
// =====================================================

router.post(
    "/resend-verification",
    authController.resendVerification
);


// =====================================================
// FORGOT PASSWORD
// =====================================================

router.post(
    "/forgot-password",
    authController.forgotPassword
);


// =====================================================
// RESET PASSWORD
// =====================================================

router.post(
    "/reset-password/:token",
    authController.resetPassword
);


// =====================================================
// GOOGLE LOGIN
// =====================================================

router.get(
    "/google",
    authController.googleLogin
);


// =====================================================
// GOOGLE CALLBACK
// =====================================================

router.get(
    "/google/callback",
    authController.googleCallback
);


// =====================================================
// APPLE LOGIN
// =====================================================

router.get(
    "/apple",
    authController.appleLogin
);


// =====================================================
// APPLE CALLBACK
// =====================================================

router.get(
    "/apple/callback",
    authController.appleCallback
);


export default router;