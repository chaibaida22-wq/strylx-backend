// =====================================================
// UPDATE USER
// =====================================================

const validateUpdateUser = (
    req,
    res,
    next
) => {

    const {
        firstname,
        lastname,
        gender,
        mainActivity,
        country,
        
        username,
        secondaryActivities,
        equipment,
        avatar
    } = req.body;


    // =========================================
    // FIRSTNAME
    // =========================================

    if (
        firstname !== undefined &&
        firstname.trim().length < 2
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Le prénom doit contenir au moins 2 caractères."

        });

    }


    // =========================================
    // LASTNAME
    // =========================================

    if (
        lastname !== undefined &&
        lastname.trim().length < 2
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Le nom doit contenir au moins 2 caractères."

        });

    }


    // =========================================
    // GENDER
    // =========================================

    if (
        gender !== undefined
    ) {

        const allowedGender = [
            "homme",
            "femme",
            "non-binaire"
        ];


        if (
            !allowedGender.includes(
                gender
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Sexe invalide."

            });

        }

    }


    // =========================================
    // USERNAME
    // =========================================

    if (
        username !== undefined &&
        username.trim().length < 3
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Le pseudo doit contenir au moins 3 caractères."

        });

    }


    // =========================================
    // SECONDARY ACTIVITIES
    // =========================================

    if (
        secondaryActivities !== undefined &&
        !Array.isArray(
            secondaryActivities
        )
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Les activités secondaires doivent être une liste."

        });

    }


    // =========================================
    // EQUIPMENT
    // =========================================

    if (
        equipment !== undefined &&
        !Array.isArray(
            equipment
        )
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Les équipements doivent être une liste."

        });

    }


    // =========================================
    // AVATAR
    // =========================================

    if (
        avatar !== undefined &&
        typeof avatar !== "string"
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Avatar invalide."

        });

    }


    next();

};


// =====================================================
// ID
// =====================================================

const validateUserId = (
    req,
    res,
    next
) => {

    const {
        id
    } = req.params;


    if (
        !id ||
        id.length !== 24
    ) {

        return res.status(400).json({

            success: false,

            message:
                "ID utilisateur invalide."

        });

    }


    next();

};


export {

    validateUpdateUser,

    validateUserId

};