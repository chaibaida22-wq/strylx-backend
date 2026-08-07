import express from "express";


import challengeController from "./challenge.controller.js";


import authMiddleware from "../../middlewares/auth.middleware.js";


const router = express.Router();




// Liste challenges

router.get(

"/",

authMiddleware,

challengeController.getChallenges

);






// Créer challenge

router.post(

"/",

authMiddleware,

challengeController.createChallenge

);






// Participer

router.post(

"/:id/join",

authMiddleware,

challengeController.joinChallenge

);






// Terminer challenge

router.put(

"/:id/complete",

authMiddleware,

challengeController.completeChallenge

);





export default router;