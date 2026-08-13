import "dotenv/config";
import emailService from "./modules/auth/email.service.js";

import app from "./app.js";
import connectDB from "./config/database.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
         await emailService.verifyConnection();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(
                `Swagger : http://localhost:${PORT}/api-docs`
            );
        });

    } catch (error) {
        console.error("❌ Erreur démarrage serveur :", error);
        process.exit(1);
    }
};

startServer();