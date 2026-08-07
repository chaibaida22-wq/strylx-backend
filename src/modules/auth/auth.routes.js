import express from "express";

import authController from "./auth.controller.js";

import {

validateRegister,

validateLogin

}
from "./auth.validation.js";



const router = express.Router();





router.post(

"/register",

validateRegister,

authController.register

);






router.post(

"/login",

validateLogin,

authController.login

);






export default router;