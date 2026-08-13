import dotenv from "dotenv";

// =====================================================
// CHARGER LES VARIABLES D'ENVIRONNEMENT
// =====================================================

dotenv.config();


// =====================================================
// IMPORTS
// =====================================================

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import {
    swaggerUi,
    specs
} from "./config/swagger.js";


// =====================================================
// ROUTES
// =====================================================

import userRoutes
    from "./modules/user/routes/user.routes.js";

import authRoutes
    from "./modules/auth/routes/auth.routes.js";

import profileRoutes
    from "./modules/profile/profile.routes.js";

import progressRoutes
    from "./modules/progress/progress.routes.js";

import challengeRoutes
    from "./modules/challenge/challenge.routes.js";

import eventRoutes
    from "./modules/event/event.routes.js";

import newsletterRoutes
    from "./modules/newsletter/newsletter.routes.js";


// =====================================================
// MIDDLEWARES
// =====================================================

import errorMiddleware
    from "./middlewares/error.middleware.js";


// =====================================================
// APP
// =====================================================

const app = express();


// =====================================================
// PATH POUR UPLOADS
// =====================================================

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const uploadPath =
    path.join(
        __dirname,
        "../uploads"
    );


// =====================================================
// MIDDLEWARES GENERAUX
// =====================================================


// -----------------------------------------------------
// CORS
// -----------------------------------------------------

app.use(
    cors({

        origin:
            process.env.FRONTEND_URL ||
            "http://localhost:5173",

        credentials: true

    })
);


// -----------------------------------------------------
// HELMET
// -----------------------------------------------------

app.use(
    helmet({

        crossOriginResourcePolicy: false

    })
);


// -----------------------------------------------------
// MORGAN
// -----------------------------------------------------

app.use(
    morgan("dev")
);


// -----------------------------------------------------
// JSON
// -----------------------------------------------------

app.use(
    express.json()
);


// -----------------------------------------------------
// FORM DATA
// -----------------------------------------------------

app.use(
    express.urlencoded({

        extended: true

    })
);


// =====================================================
// SERVIR LES IMAGES
// =====================================================

app.use(
    "/uploads",
    express.static(uploadPath)
);


// =====================================================
// ROUTES API
// =====================================================


// -----------------------------------------------------
// AUTH
// -----------------------------------------------------

app.use(
    "/api/auth",
    authRoutes
);


// -----------------------------------------------------
// USERS
// -----------------------------------------------------

app.use(
    "/api/users",
    userRoutes
);


// -----------------------------------------------------
// PROFILE
// -----------------------------------------------------

app.use(
    "/api/profile",
    profileRoutes
);


// -----------------------------------------------------
// PROGRESS
// -----------------------------------------------------

app.use(
    "/api/progress",
    progressRoutes
);


// -----------------------------------------------------
// CHALLENGES
// -----------------------------------------------------

app.use(
    "/api/challenges",
    challengeRoutes
);


// -----------------------------------------------------
// EVENTS
// -----------------------------------------------------

app.use(
    "/api/events",
    eventRoutes
);


// -----------------------------------------------------
// NEWSLETTER
// -----------------------------------------------------

app.use(
    "/api/newsletter",
    newsletterRoutes
);


// =====================================================
// SWAGGER
// =====================================================

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);


// =====================================================
// TEST API
// =====================================================

app.get(
    "/",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Bienvenue sur STRYL'X API"

        });

    }
);


// =====================================================
// TEST UPLOAD
// =====================================================

app.get(
    "/test-upload",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Upload folder accessible",

            path:
                uploadPath

        });

    }
);


// =====================================================
// GESTION DES ERREURS
// =====================================================

app.use(
    errorMiddleware
);


// =====================================================
// EXPORT
// =====================================================

export default app;