import {
    subscribe
} from "./newsletter.service.js";


// =================================
// SUBSCRIBE NEWSLETTER
// =================================

const subscribeNewsletter = async (req, res, next) => {

    try {

        const { email } = req.body;


        // =============================
        // Vérifier email
        // =============================

        if (!email) {

            return res.status(400).json({
                success: false,
                message: "L'adresse email est obligatoire."
            });

        }


        // =============================
        // Validation email
        // =============================

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email)) {

            return res.status(400).json({
                success: false,
                message: "Veuillez entrer une adresse email valide."
            });

        }


        // =============================
        // Inscription
        // =============================

        await subscribe(
            email.toLowerCase().trim()
        );


        // =============================
        // Réponse
        // =============================

        return res.status(201).json({

            success: true,

            message:
                "Merci ! Votre inscription est confirmée."

        });

    } catch (error) {

        next(error);

    }

};


export {
    subscribeNewsletter
};