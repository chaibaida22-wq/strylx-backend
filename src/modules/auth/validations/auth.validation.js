// =====================================================
// VALIDATION REGISTER
// =====================================================

const validateRegister = (req, res, next) => {

    const {
        email,
        birthdate,
        password,
        confirmPassword,
        firstname,
        lastname,
        gender,
        mainActivity,
        country
    } = req.body;


    if (
        !email ||
        !birthdate ||
        !password ||
        !confirmPassword ||
        !firstname ||
        !lastname ||
        !gender ||
        !mainActivity ||
        !country
    ) {

        return res.status(400).json({
            success: false,
            message: "Tous les champs sont obligatoires."
        });
    }


    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email)) {

        return res.status(400).json({
            success: false,
            message: "Adresse email invalide."
        });
    }


    if (password.length < 6) {

        return res.status(400).json({
            success: false,
            message:
                "Le mot de passe doit contenir au minimum 6 caractères."
        });
    }


    if (password !== confirmPassword) {

        return res.status(400).json({
            success: false,
            message:
                "Les mots de passe ne correspondent pas."
        });
    }


    const birthDateObject =
        new Date(birthdate);


    if (
        Number.isNaN(
            birthDateObject.getTime()
        )
    ) {

        return res.status(400).json({
            success: false,
            message:
                "Date de naissance invalide."
        });
    }


    if (
        birthDateObject > new Date()
    ) {

        return res.status(400).json({
            success: false,
            message:
                "La date de naissance ne peut pas être dans le futur."
        });
    }


    next();
};


// =====================================================
// VALIDATION LOGIN
// =====================================================

const validateLogin = (req, res, next) => {

    const {
        email,
        password
    } = req.body;


    if (!email || !password) {

        return res.status(400).json({
            success: false,
            message:
                "Email et mot de passe obligatoires."
        });
    }


    const normalizedEmail =
        email.trim().toLowerCase();


    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(normalizedEmail)) {

        return res.status(400).json({
            success: false,
            message:
                "Adresse email invalide."
        });
    }


    req.body.email =
        normalizedEmail;


    next();
};


// =====================================================
// VALIDATION FORGOT PASSWORD
// =====================================================

const validateForgotPassword = (req, res, next) => {

    console.log(
        "📩 FORGOT PASSWORD BODY:",
        req.body
    );


    const {
        email
    } = req.body;


    // Vérifier email obligatoire

    if (
        !email ||
        !email.trim()
    ) {

        return res.status(400).json({
            success: false,
            message:
                "L'adresse email est obligatoire."
        });
    }


    // Normalisation

    const normalizedEmail =
        email.trim().toLowerCase();


    // Validation format email

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        !emailRegex.test(
            normalizedEmail
        )
    ) {

        return res.status(400).json({
            success: false,
            message:
                "Adresse email invalide."
        });
    }


    // Remplacer l'email par sa version normalisée

    req.body.email =
        normalizedEmail;


    next();
};


// =====================================================
// VALIDATION RESET PASSWORD
// =====================================================

const validateResetPassword = (
    req,
    res,
    next
) => {

    const {
        password,
        confirmPassword
    } = req.body;


    const {
        token
    } = req.params;


    if (!token) {

        return res.status(400).json({
            success: false,
            message:
                "Token de réinitialisation manquant."
        });
    }


    if (
        !password ||
        !confirmPassword
    ) {

        return res.status(400).json({
            success: false,
            message:
                "Le mot de passe et sa confirmation sont obligatoires."
        });
    }


    if (
        password.length < 6
    ) {

        return res.status(400).json({
            success: false,
            message:
                "Le mot de passe doit contenir au minimum 6 caractères."
        });
    }


    if (
        password !== confirmPassword
    ) {

        return res.status(400).json({
            success: false,
            message:
                "Les mots de passe ne correspondent pas."
        });
    }


    next();
};


// =====================================================
// VALIDATION RESEND VERIFICATION
// =====================================================

const validateResendVerification = (
    req,
    res,
    next
) => {

    const {
        email
    } = req.body;


    if (
        !email ||
        !email.trim()
    ) {

        return res.status(400).json({
            success: false,
            message:
                "L'adresse email est obligatoire."
        });
    }


    const normalizedEmail =
        email.trim().toLowerCase();


    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        !emailRegex.test(
            normalizedEmail
        )
    ) {

        return res.status(400).json({
            success: false,
            message:
                "Adresse email invalide."
        });
    }


    req.body.email =
        normalizedEmail;


    next();
};


// =====================================================
// EXPORT
// =====================================================

export {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
    validateResendVerification
};