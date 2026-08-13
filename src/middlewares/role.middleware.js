// =====================================================
// ADMIN
// =====================================================

const requireAdmin = (
    req,
    res,
    next
) => {

    if (!req.user) {

        return res.status(401).json({

            success: false,

            message:
                "Authentification requise."

        });

    }


    if (req.user.role !== "admin") {

        return res.status(403).json({

            success: false,

            message:
                "Accès réservé aux administrateurs."

        });

    }


    next();

};


// =====================================================
// USER OR ADMIN
// =====================================================

const authorizeUser = (
    req,
    res,
    next
) => {

    if (!req.user) {

        return res.status(401).json({

            success: false,

            message:
                "Authentification requise."

        });

    }


    // Admin peut accéder à tout

    if (
        req.user.role === "admin"
    ) {

        return next();

    }


    // Vérifier que l'utilisateur
    // accède à son propre compte

    if (
        req.user.id !== req.params.id
    ) {

        return res.status(403).json({

            success: false,

            message:
                "Vous ne pouvez pas accéder à ce compte."

        });

    }


    next();

};


export {

    requireAdmin,

    authorizeUser

};