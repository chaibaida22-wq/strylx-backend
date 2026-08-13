import jwt from "jsonwebtoken";


// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const authenticate = (req, res, next) => {

    try {

        // =========================================
        // RECUPERER LE HEADER AUTHORIZATION
        // =========================================

        const authHeader =
            req.headers.authorization;


        // =========================================
        // VERIFIER LE HEADER
        // =========================================

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentification requise."

            });

        }


        // =========================================
        // VERIFIER BEARER
        // =========================================

        if (
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Format du token invalide."

            });

        }


        // =========================================
        // EXTRAIRE TOKEN
        // =========================================

        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({

                success: false,

                message:
                    "Token manquant."

            });

        }


        // =========================================
        // VERIFIER JWT
        // =========================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // =========================================
        // AJOUTER USER A LA REQUETE
        // =========================================

        req.user = decoded;


        // =========================================
        // CONTINUER
        // =========================================

        next();

    }

    catch (error) {

        console.error(
            "Erreur authentication :",
            error.message
        );


        return res.status(401).json({

            success: false,

            message:
                "Token invalide ou expiré."

        });

    }

};


export default authenticate;