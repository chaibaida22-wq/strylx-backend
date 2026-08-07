import express from "express";


import profileController from "./profile.controller.js";


import authMiddleware from "../../middlewares/auth.middleware.js";


import upload from "../../middlewares/upload.middleware.js";



const router = express.Router();





// ===============================
// GET MY PROFILE
// ===============================


router.get(

"/me",

authMiddleware,

profileController.getProfile

);







// ===============================
// UPDATE PROFILE
// ===============================


router.put(

"/me",

authMiddleware,

upload.single("avatar"),

profileController.updateProfile

);







export default router;