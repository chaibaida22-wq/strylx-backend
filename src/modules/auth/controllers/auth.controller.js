import authService from "../auth.service.js";


// =====================================================
// REGISTER
// =====================================================

const register = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await authService.register(
                req.body,
                req.file
            );


        return res.status(201).json({

            success: true,

            message:
                "Compte créé avec succès. Veuillez confirmer votre adresse email.",

            user:
                result.user

        });

    }

    catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        next(error);

    }

};


// =====================================================
// LOGIN
// =====================================================

const login = async (
    req,
    res,
    next
) => {

    try {

        const {
            email,
            password
        } = req.body;


        const result =
            await authService.login(
                email,
                password
            );


        return res.status(200).json({

            success: true,

            message:
                "Connexion réussie.",

            token:
                result.token,

            user:
                result.user

        });

    }

    catch (error) {

        next(error);

    }

};


// =====================================================
// GOOGLE LOGIN
// =====================================================

const googleLogin = (
    req,
    res,
    next
) => {

    try {

        const googleUrl =
            authService.getGoogleAuthorizationUrl();


        console.log(
            "GOOGLE LOGIN REDIRECT :",
            googleUrl
        );


        return res.redirect(
            googleUrl
        );

    }

    catch (error) {

        next(error);

    }

};


// =====================================================
// GOOGLE CALLBACK
// =====================================================

const googleCallback = async (
    req,
    res
) => {

    try {

        console.log(
            "================================="
        );

        console.log(
            "🔵 GOOGLE CALLBACK"
        );

        console.log(
            "QUERY :",
            req.query
        );


        const {
            code
        } = req.query;


        if (!code) {

            return res.redirect(
                `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=google`
            );

        }


        console.log(
            "CODE GOOGLE REÇU"
        );


        const result =
            await authService.loginWithGoogle(
                code
            );


        const frontendUrl =
            process.env.FRONTEND_URL ||
            "http://localhost:5173";


        // =================================================
        // UTILISATEUR EXISTANT
        // =================================================

        if (
            result.type === "LOGIN"
        ) {

            console.log(
                "✅ CONNEXION GOOGLE"
            );


            return res.redirect(

                `${frontendUrl}/auth/callback?token=${encodeURIComponent(
                    result.token
                )}`

            );

        }


        // =================================================
        // NOUVEL UTILISATEUR
        // =================================================

        if (
            result.type === "COMPLETE_PROFILE"
        ) {

            console.log(
                "🆕 GOOGLE - COMPLETE PROFILE"
            );


            const params =
                new URLSearchParams({

                    token:
                        result.registrationToken,

                    email:
                        result.googleUser.email,

                    firstname:
                        result.googleUser.firstname,

                    lastname:
                        result.googleUser.lastname,

                    picture:
                        result.googleUser.picture

                });


            return res.redirect(

                `${frontendUrl}/complete-profile?${params.toString()}`

            );

        }


        return res.redirect(
            `${frontendUrl}/login?error=google`
        );

    }

    catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "GOOGLE CALLBACK ERROR:",
            error
        );

        console.error(
            "================================="
        );


        const frontendUrl =
            process.env.FRONTEND_URL ||
            "http://localhost:5173";


        return res.redirect(
            `${frontendUrl}/login?error=google`
        );

    }

};


// =====================================================
// COMPLETE GOOGLE PROFILE
// =====================================================

const completeGoogleRegistration =
    async (
        req,
        res,
        next
    ) => {

        try {

            console.log(
                "================================="
            );

            console.log(
                "🟣 COMPLETE GOOGLE PROFILE"
            );

            console.log(
                "BODY :",
                req.body
            );


            const {
                registrationToken
            } = req.body;


            const result =
                await authService.completeGoogleRegistration(

                    registrationToken,

                    req.body,

                    req.file

                );


            return res.status(201).json({

                success: true,

                message:
                    "Compte Google créé avec succès.",

                token:
                    result.token,

                user:
                    result.user

            });

        }

        catch (error) {

            console.error(
                "COMPLETE GOOGLE ERROR:",
                error
            );

            next(error);

        }

    };


// =====================================================
// VERIFY EMAIL
// =====================================================

const verifyEmail = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await authService.verifyEmail(
                req.params.token
            );


        return res.status(200).json({

            success: true,

            message:
                result.alreadyVerified
                    ? "Votre adresse email est déjà vérifiée."
                    : "Votre adresse email a été vérifiée avec succès.",

            user:
                result

        });

    }

    catch (error) {

        next(error);

    }

};


// =====================================================
// RESEND VERIFICATION
// =====================================================

const resendVerification =
    async (
        req,
        res,
        next
    ) => {

        try {

            await authService.generateNewVerificationToken(
                req.body.email
            );


            return res.status(200).json({

                success: true,

                message:
                    "Si cette adresse existe et n'est pas encore vérifiée, un nouveau lien de vérification a été envoyé."

            });

        }

        catch (error) {

            next(error);

        }

    };


// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword =
    async (
        req,
        res,
        next
    ) => {

        try {

            await authService.createPasswordResetToken(
                req.body.email
            );


            return res.status(200).json({

                success: true,

                message:
                    "Si cette adresse existe, un lien de réinitialisation a été envoyé."

            });

        }

        catch (error) {

            next(error);

        }

    };


// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword =
    async (
        req,
        res,
        next
    ) => {

        try {

            await authService.resetPassword(

                req.params.token,

                req.body.password

            );


            return res.status(200).json({

                success: true,

                message:
                    "Votre mot de passe a été réinitialisé avec succès."

            });

        }

        catch (error) {

            next(error);

        }

    };


// =====================================================
// CURRENT USER
// =====================================================

const getCurrentUser =
    async (
        req,
        res,
        next
    ) => {

        try {

            const user =
                await authService.getCurrentUser(
                    req.user.id
                );


            return res.status(200).json({

                success: true,

                user

            });

        }

        catch (error) {

            next(error);

        }

    };


// =====================================================
// LOGOUT
// =====================================================

const logout = (
    req,
    res
) => {

    return res.status(200).json({

        success: true,

        message:
            "Déconnexion réussie."

    });

};


// =====================================================
// EXPORT
// =====================================================

export default {

    register,

    login,

    googleLogin,

    googleCallback,

    completeGoogleRegistration,

    verifyEmail,

    resendVerification,

    forgotPassword,

    resetPassword,

    getCurrentUser,

    logout

};