import authService from "../auth.service.js";

// =====================================================
// REGISTER
// =====================================================

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);

        return res.status(201).json({
            success: true,
            message:
                "Compte créé avec succès. Veuillez confirmer votre adresse email.",
            user: result.user
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        next(error);
    }
};


// =====================================================
// LOGIN
// =====================================================

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login(
            email,
            password
        );

        return res.status(200).json({
            success: true,
            message: "Connexion réussie.",
            token: result.token,
            user: result.user
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        next(error);
    }
};


// =====================================================
// VERIFY EMAIL
// =====================================================

const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        console.log("=================================");
        console.log("📩 VERIFY EMAIL CONTROLLER");
        console.log("TOKEN :", token);
        console.log("=================================");

        const result =
            await authService.verifyEmail(token);

        return res.status(200).json({
            success: true,

            message:
                result.alreadyVerified
                    ? "Votre adresse email est déjà vérifiée."
                    : "Votre adresse email a été vérifiée avec succès.",

            user: result
        });

    } catch (error) {
        console.error("VERIFY EMAIL ERROR:", error);
        next(error);
    }
};


// =====================================================
// RESEND VERIFICATION
// =====================================================

const resendVerification = async (
    req,
    res,
    next
) => {
    try {
        const { email } = req.body;

        await authService.generateNewVerificationToken(
            email
        );

        return res.status(200).json({
            success: true,

            message:
                "Si cette adresse existe et n'est pas encore vérifiée, un nouveau lien de vérification a été envoyé."
        });

    } catch (error) {
        console.error(
            "RESEND VERIFICATION ERROR:",
            error
        );

        next(error);
    }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (
    req,
    res,
    next
) => {
    try {
        const { email } = req.body;

        await authService.createPasswordResetToken(
            email
        );

        return res.status(200).json({
            success: true,

            message:
                "Si cette adresse email existe, un lien de réinitialisation a été envoyé."
        });

    } catch (error) {
        console.error(
            "FORGOT PASSWORD ERROR:",
            error
        );

        next(error);
    }
};


// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (
    req,
    res,
    next
) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        await authService.resetPassword(
            token,
            password
        );

        return res.status(200).json({
            success: true,

            message:
                "Votre mot de passe a été réinitialisé avec succès."
        });

    } catch (error) {
        console.error(
            "RESET PASSWORD ERROR:",
            error
        );

        next(error);
    }
};


// =====================================================
// GOOGLE LOGIN
// =====================================================
// GET /api/auth/google
//
// Le navigateur arrive ici depuis le frontend.
// On construit l'URL Google puis on redirige
// l'utilisateur vers Google.
// =====================================================

const googleLogin = (req, res) => {
    try {

        const googleClientId =
            process.env.GOOGLE_CLIENT_ID;

        const googleCallbackUrl =
            process.env.GOOGLE_CALLBACK_URL ||
            "http://localhost:5000/api/auth/google/callback";


        // -------------------------------------------------
        // Vérification configuration
        // -------------------------------------------------

        if (!googleClientId) {

            console.error(
                "❌ GOOGLE_CLIENT_ID manquant dans .env"
            );

            return res.status(500).json({
                success: false,

                message:
                    "GOOGLE_CLIENT_ID n'est pas configuré."
            });
        }


        // -------------------------------------------------
        // URL Google
        // -------------------------------------------------

        const googleUrl =
            "https://accounts.google.com/o/oauth2/v2/auth" +
            `?client_id=${encodeURIComponent(
                googleClientId
            )}` +
            `&redirect_uri=${encodeURIComponent(
                googleCallbackUrl
            )}` +
            "&response_type=code" +
            "&scope=openid%20email%20profile" +
            "&access_type=offline";


        console.log("=================================");
        console.log("🔵 GOOGLE LOGIN");
        console.log("CLIENT ID :", googleClientId);
        console.log(
            "CALLBACK :",
            googleCallbackUrl
        );
        console.log("=================================");


        return res.redirect(
            googleUrl
        );

    } catch (error) {

        console.error(
            "GOOGLE LOGIN ERROR:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Impossible de démarrer la connexion Google."
        });
    }
};


// =====================================================
// GOOGLE CALLBACK
// =====================================================
// GET /api/auth/google/callback
//
// Google renvoie ici avec ?code=...
// =====================================================

const googleCallback = async (
    req,
    res,
    next
) => {

    try {

        const { code } = req.query;


        // -------------------------------------------------
        // Vérifier le code
        // -------------------------------------------------

        if (!code) {

            console.error(
                "❌ CODE GOOGLE MANQUANT"
            );

            return res.redirect(
                `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=google`
            );
        }


        console.log("=================================");
        console.log("🔵 GOOGLE CALLBACK");
        console.log("CODE GOOGLE REÇU");
        console.log("=================================");


        // -------------------------------------------------
        // Service Google
        // -------------------------------------------------

        const result =
            await authService.loginWithGoogle(
                code
            );


        if (
            !result ||
            !result.token
        ) {

            throw new Error(
                "Token JWT Google manquant."
            );
        }


        // -------------------------------------------------
        // Frontend
        // -------------------------------------------------

        const frontendUrl =
            process.env.FRONTEND_URL ||
            "http://localhost:5173";


        // -------------------------------------------------
        // Redirection frontend
        // -------------------------------------------------

        return res.redirect(
            `${frontendUrl}/auth/callback?token=${encodeURIComponent(
                result.token
            )}`
        );

    } catch (error) {

        console.error(
            "GOOGLE CALLBACK ERROR:",
            error
        );

        return res.redirect(
            `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=google`
        );
    }
};


// =====================================================
// APPLE LOGIN
// =====================================================
// GET /api/auth/apple
// =====================================================

const appleLogin = (req, res) => {

    try {

        const appleClientId =
            process.env.APPLE_CLIENT_ID;

        const appleRedirectUri =
            process.env.APPLE_REDIRECT_URI ||
            "http://localhost:5000/api/auth/apple/callback";


        // -------------------------------------------------
        // Vérification configuration
        // -------------------------------------------------

        if (!appleClientId) {

            console.error(
                "❌ APPLE_CLIENT_ID manquant dans .env"
            );

            return res.status(500).json({

                success: false,

                message:
                    "APPLE_CLIENT_ID n'est pas configuré."
            });
        }


        // -------------------------------------------------
        // Paramètres Apple
        // -------------------------------------------------

        const params =
            new URLSearchParams({

                response_type: "code",

                response_mode: "form_post",

                client_id:
                    appleClientId,

                redirect_uri:
                    appleRedirectUri,

                scope:
                    "name email"

            });


        const appleUrl =
            `https://appleid.apple.com/auth/authorize?${params.toString()}`;


        console.log("=================================");
        console.log(" APPLE LOGIN");
        console.log(
            "CLIENT ID :",
            appleClientId
        );
        console.log(
            "CALLBACK :",
            appleRedirectUri
        );
        console.log("=================================");


        return res.redirect(
            appleUrl
        );

    } catch (error) {

        console.error(
            "APPLE LOGIN ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de démarrer la connexion Apple."
        });
    }
};


// =====================================================
// APPLE CALLBACK
// =====================================================
// POST /api/auth/apple/callback
//
// Apple utilise response_mode=form_post.
// =====================================================

const appleCallback = async (
    req,
    res,
    next
) => {

    try {

        const {
            code,
            user
        } = req.body;


        // -------------------------------------------------
        // Vérifier le code
        // -------------------------------------------------

        if (!code) {

            console.error(
                "❌ CODE APPLE MANQUANT"
            );

            return res.redirect(
                `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=apple`
            );
        }


        // -------------------------------------------------
        // Parser user Apple
        // -------------------------------------------------

        let appleUser = null;


        if (user) {

            try {

                appleUser =
                    typeof user === "string"
                        ? JSON.parse(user)
                        : user;

            } catch (error) {

                console.error(
                    "APPLE USER JSON ERROR:",
                    error
                );

                appleUser = null;
            }
        }


        console.log("=================================");
        console.log(" APPLE CALLBACK");
        console.log("CODE APPLE REÇU");
        console.log(
            "APPLE USER :",
            appleUser
        );
        console.log("=================================");


        // -------------------------------------------------
        // Service Apple
        // -------------------------------------------------

        const result =
            await authService.loginWithApple(
                code,
                appleUser
            );


        if (
            !result ||
            !result.token
        ) {

            throw new Error(
                "Token JWT Apple manquant."
            );
        }


        // -------------------------------------------------
        // Frontend
        // -------------------------------------------------

        const frontendUrl =
            process.env.FRONTEND_URL ||
            "http://localhost:5173";


        return res.redirect(
            `${frontendUrl}/auth/callback?token=${encodeURIComponent(
                result.token
            )}`
        );

    } catch (error) {

        console.error(
            "APPLE CALLBACK ERROR:",
            error
        );

        return res.redirect(
            `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=apple`
        );
    }
};


// =====================================================
// CURRENT USER
// =====================================================

const getCurrentUser = async (
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

    } catch (error) {

        console.error(
            "GET CURRENT USER ERROR:",
            error
        );

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

    verifyEmail,

    resendVerification,

    forgotPassword,

    resetPassword,

    googleLogin,

    googleCallback,

    appleLogin,

    appleCallback,

    getCurrentUser,

    logout

};