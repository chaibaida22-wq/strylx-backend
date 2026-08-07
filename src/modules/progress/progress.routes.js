import express from "express";


import progressController from "./progress.controller.js";


import authMiddleware from "../../middlewares/auth.middleware.js";



const router = express.Router();




// récupérer progression

router.get(

"/me",

authMiddleware,

progressController.getProgress

);







// ajouter XP

router.post(

"/xp",

authMiddleware,

progressController.addXP

);







// terminer un challenge

router.post(

"/challenge",

authMiddleware,

progressController.completeChallenge

);






export default router;