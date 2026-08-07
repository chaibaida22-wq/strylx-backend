import express from "express";

import eventController from "./event.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";


const router = express.Router();




// GET EVENTS

router.get(

"/",

authMiddleware,

eventController.getEvents

);




// GET EVENT DETAIL

router.get(

"/:id",

authMiddleware,

eventController.getEvent

);




// CREATE EVENT

router.post(

"/",

authMiddleware,

eventController.createEvent

);




// JOIN EVENT

router.post(

"/:id/join",

authMiddleware,

eventController.joinEvent

);




// LEAVE EVENT

router.delete(

"/:id/leave",

authMiddleware,

eventController.leaveEvent

);



export default router;