import express from "express";

import userController
    from "../controllers/user.controller.js";

import {
    validateUpdateUser,
    validateUserId
} from "../validations/user.validation.js";

import authenticate
    from "../../../middlewares/auth.middleware.js";

import {
    requireAdmin,
    authorizeUser
} from "../../../middlewares/role.middleware.js";


const router =
    express.Router();


// =====================================================
// ADMIN
// GET ALL USERS
// =====================================================

router.get(
    "/",
    authenticate,
    requireAdmin,
    userController.getUsers
);


// =====================================================
// ADMIN
// COUNT USERS
// =====================================================

router.get(
    "/count",
    authenticate,
    requireAdmin,
    userController.countUsers
);


// =====================================================
// ADMIN
// GET USER BY EMAIL
// =====================================================

router.get(
    "/email/:email",
    authenticate,
    requireAdmin,
    userController.getUserByEmail
);


// =====================================================
// USER / ADMIN
// GET USER
// =====================================================

router.get(
    "/:id",
    authenticate,
    validateUserId,
    authorizeUser,
    userController.getUser
);


// =====================================================
// USER / ADMIN
// UPDATE USER
// =====================================================

router.put(
    "/:id",
    authenticate,
    validateUserId,
    authorizeUser,
    validateUpdateUser,
    userController.updateUser
);


// =====================================================
// ADMIN
// DELETE USER
// =====================================================

router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    validateUserId,
    userController.deleteUser
);


export default router;