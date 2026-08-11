import express from "express";

import {
    subscribeNewsletter
} from "./newsletter.controller.js";


const router = express.Router();


// =================================
// POST /api/newsletter
// =================================

router.post(
    "/",
    subscribeNewsletter
);


export default router;