import express from "express";

import authController
    from "../controllers/auth.controller.js";

import upload
    from "../../../middlewares/upload.middleware.js";


const router =
    express.Router();


// =====================================================
// REGISTER
// =====================================================

router.post(

    "/register",

    upload.single("profileImage"),

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
// GOOGLE
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
// GOOGLE COMPLETE PROFILE
// =====================================================

router.post(

    "/google/complete-profile",

    upload.single("profileImage"),

    authController.completeGoogleRegistration

);


// =====================================================
// CURRENT USER
// =====================================================

router.get(

    "/me",

    authController.getCurrentUser

);


// =====================================================
// LOGOUT
// =====================================================

router.post(

    "/logout",

    authController.logout

);


export default router;