import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "STRYL'X API",
            version: "1.0.0",
            description: "Documentation STRYL'X"
        },
        servers: [
            {
                url: "http://localhost:5000"
            }
        ]
    },
    apis: [
        "./src/modules/**/*.js"
    ]
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };