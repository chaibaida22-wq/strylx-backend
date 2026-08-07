import dotenv from "dotenv";

dotenv.config();

import "./modules/badge/badge.model.js";

import app from "./app.js";

import connectDB from "./config/database.js";



const PORT = process.env.PORT || 5000;



const startServer = async()=>{


    try{


        await connectDB();



        app.listen(PORT,()=>{


            console.log(
                `Server running on http://localhost:${PORT}`
            );


            console.log(
                `Swagger : http://localhost:${PORT}/api-docs`
            );


        });



    }
    catch(error){


        console.error(
            "Server Error :",
            error
        );


        process.exit(1);


    }


};



startServer();