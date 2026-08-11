import Newsletter from "./newsletter.model.js";


// =================================
// SUBSCRIBE TO NEWSLETTER
// =================================

export const subscribe = async (email) => {

    // Vérifier si l'email existe déjà
    const existingSubscriber = await Newsletter.findOne({
        email
    });

    if (existingSubscriber) {

        const error = new Error(
            "Cette adresse email est déjà inscrite à la newsletter."
        );

        error.statusCode = 409;

        throw error;
    }


    // Créer le nouvel abonné
    const subscriber = await Newsletter.create({
        email
    });


    return subscriber;
};