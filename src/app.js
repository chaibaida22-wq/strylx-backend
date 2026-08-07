import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";


import { swaggerUi, specs } from "./config/swagger.js";


import userRoutes from "./modules/user/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";


import errorMiddleware from "./middlewares/error.middleware.js";
import progressRoutes from "./modules/progress/progress.routes.js";
import challengeRoutes from "./modules/challenge/challenge.routes.js";
import eventRoutes from "./modules/event/event.routes.js";



const app = express();




// =================================
// PATH POUR UPLOADS
// =================================


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);



const uploadPath = path.join(
    __dirname,
    "../uploads"
);





// =================================
// MIDDLEWARES GENERAUX
// =================================


app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true
    })
);



app.use(

    helmet({

        crossOriginResourcePolicy:false

    })

);



app.use(
    morgan("dev")
);



app.use(
    express.json()
);



app.use(

    express.urlencoded({

        extended:true

    })

);





// =================================
// SERVIR LES IMAGES
// =================================


// Exemple:
// http://localhost:5000/uploads/image.png


app.use(

    "/uploads",

    express.static(uploadPath)

);






// =================================
// ROUTES API
// =================================



app.use(

    "/api/auth",

    authRoutes

);



app.use(

    "/api/users",

    userRoutes

);



app.use(

    "/api/profile",

    profileRoutes

);




app.use(

"/api/progress",

progressRoutes

);

app.use(
    "/api/challenges",
    challengeRoutes
);

app.use(
    "/api/events",
    eventRoutes
);

// =================================
// SWAGGER
// =================================


app.use(

    "/api-docs",

    swaggerUi.serve,

    swaggerUi.setup(specs)

);






// =================================
// TEST API
// =================================


app.get("/",(req,res)=>{


    res.status(200).json({

        success:true,

        message:"Bienvenue sur STRYL'X API "

    });


});






// =================================
// TEST UPLOAD
// =================================


app.get("/test-upload",(req,res)=>{


    res.json({

        message:"Upload folder accessible",

        path:uploadPath

    });


});







// =================================
// GESTION ERREURS
// =================================


app.use(errorMiddleware);





export default app;