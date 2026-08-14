import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../user/models/user.model.js";
import emailService from "./email.service.js";


// =====================================================
// CONFIGURATION
// =====================================================

const JWT_SECRET = process.env.JWT_SECRET;

const JWT_EXPIRES_IN =
    process.env.JWT_EXPIRES_IN || "7d";

const FRONTEND_URL =
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

const GOOGLE_CLIENT_ID =
    process.env.GOOGLE_CLIENT_ID;

const GOOGLE_CLIENT_SECRET =
    process.env.GOOGLE_CLIENT_SECRET;

const GOOGLE_CALLBACK_URL =
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:5000/api/auth/google/callback";


// =====================================================
// ERROR HELPER
// =====================================================

const createError = (
    message,
    statusCode = 400,
    code = null
) => {

    const error = new Error(message);

    error.statusCode = statusCode;

    if (code) {
        error.code = code;
    }

    return error;
};


// =====================================================
// JWT
// =====================================================

const generateJWT = (user) => {

    if (!JWT_SECRET) {

        throw createError(
            "JWT_SECRET n'est pas configuré.",
            500
        );

    }

    return jwt.sign(

        {
            id: user._id.toString(),
            role: user.role
        },

        JWT_SECRET,

        {
            expiresIn: JWT_EXPIRES_IN
        }

    );
};


// =====================================================
// USER RESPONSE
// =====================================================

const formatUser = (user) => {

    return {

        id: user._id,

        firstname: user.firstname,

        lastname: user.lastname,

        email: user.email,

        birthdate: user.birthdate,

        gender: user.gender,

        mainActivity: user.mainActivity,

        country: user.country,

        profileImage: user.profileImage,

        role: user.role,

        isEmailVerified: user.isEmailVerified

    };

};


// =====================================================
// CALCUL AGE
// =====================================================

const calculateAge = (birthdate) => {

    const birth = new Date(birthdate);

    const today = new Date();

    let age =
        today.getFullYear() -
        birth.getFullYear();

    const monthDifference =
        today.getMonth() -
        birth.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() < birth.getDate()
        )
    ) {

        age--;

    }

    return age;
};


// =====================================================
// REGISTER CLASSIQUE
// =====================================================

const register = async (
    userData,
    profileImage = null
) => {

    const {
        firstname,
        lastname,
        email,
        birthdate,
        password,
        confirmPassword,
        gender,
        mainActivity,
        country
    } = userData;


    if (
        typeof firstname !== "string" ||
        !firstname.trim()
    ) {

        throw createError(
            "Le prénom est obligatoire."
        );

    }


    if (
        typeof lastname !== "string" ||
        !lastname.trim()
    ) {

        throw createError(
            "Le nom est obligatoire."
        );

    }


    if (
        typeof email !== "string" ||
        !email.trim()
    ) {

        throw createError(
            "L'adresse email est obligatoire."
        );

    }


    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        !emailRegex.test(
            email.trim()
        )
    ) {

        throw createError(
            "L'adresse email n'est pas valide."
        );

    }


    if (!password) {

        throw createError(
            "Le mot de passe est obligatoire."
        );

    }


    if (password.length < 8) {

        throw createError(
            "Le mot de passe doit contenir au moins 8 caractères."
        );

    }


    if (
        !confirmPassword ||
        password !== confirmPassword
    ) {

        throw createError(
            "Les mots de passe ne correspondent pas."
        );

    }


    if (!birthdate) {

        throw createError(
            "La date de naissance est obligatoire."
        );

    }


    const birthDateObject =
        new Date(
            `${birthdate}T00:00:00`
        );


    if (
        Number.isNaN(
            birthDateObject.getTime()
        )
    ) {

        throw createError(
            "Date de naissance invalide."
        );

    }


    if (
        birthDateObject > new Date()
    ) {

        throw createError(
            "La date de naissance ne peut pas être dans le futur."
        );

    }


    const age =
        calculateAge(
            birthDateObject
        );


    if (age < 18) {

        throw createError(
            "L'inscription est réservée aux personnes âgées de 18 ans ou plus."
        );

    }


    const allowedGenders = [
        "homme",
        "femme",
        "non-binaire"
    ];


    if (!gender) {

        throw createError(
            "Le sexe est obligatoire."
        );

    }


    if (
        !allowedGenders.includes(gender)
    ) {

        throw createError(
            "Genre invalide."
        );

    }


    if (!mainActivity) {

        throw createError(
            "L'activité principale est obligatoire."
        );

    }


    if (!country) {

        throw createError(
            "Le pays est obligatoire."
        );

    }


    const normalizedEmail =
        email
            .trim()
            .toLowerCase();


    const normalizedFirstname =
        firstname.trim();


    const normalizedLastname =
        lastname.trim();


    const existingUser =
        await User.findOne({
            email: normalizedEmail
        });


    if (existingUser) {

        if (existingUser.isEmailVerified) {

            throw createError(
                "Cette adresse email est déjà utilisée.",
                409,
                "EMAIL_ALREADY_EXISTS"
            );

        }

        throw createError(
            "Un compte existe déjà avec cette adresse email mais n'est pas encore vérifié.",
            409,
            "EMAIL_NOT_VERIFIED"
        );

    }


    const hashedPassword =
        await bcrypt.hash(
            password,
            12
        );


    const emailVerificationToken =
        crypto
            .randomBytes(32)
            .toString("hex");


    const emailVerificationExpires =
        new Date(
            Date.now() +
            24 * 60 * 60 * 1000
        );


    let profileImagePath = null;


    if (profileImage) {

        profileImagePath =
            `/uploads/${profileImage.filename}`;

    }


    const user =
        await User.create({

            firstname:
                normalizedFirstname,

            lastname:
                normalizedLastname,

            email:
                normalizedEmail,

            birthdate:
                birthDateObject,

            password:
                hashedPassword,

            gender,

            mainActivity,

            country,

            profileImage:
                profileImagePath,

            role:
                "user",

            isEmailVerified:
                false,

            emailVerificationToken,

            emailVerificationExpires

        });


    const verificationUrl =
        `${FRONTEND_URL}/verify-email/${emailVerificationToken}`;


    try {

        await emailService.sendVerificationEmail({

            email:
                user.email,

            firstname:
                user.firstname,

            verificationUrl

        });

    }

    catch (error) {

        await User.findByIdAndDelete(
            user._id
        );

        throw createError(
            "Impossible d'envoyer l'email de vérification.",
            500
        );

    }


    return {

        user:
            formatUser(user)

    };

};


// =====================================================
// LOGIN CLASSIQUE
// =====================================================

const login = async (
    email,
    password
) => {

    if (
        typeof email !== "string" ||
        !email.trim()
    ) {

        throw createError(
            "L'adresse email est obligatoire."
        );

    }


    if (!password) {

        throw createError(
            "Le mot de passe est obligatoire."
        );

    }


    const normalizedEmail =
        email
            .trim()
            .toLowerCase();


    const user =
        await User.findOne({
            email: normalizedEmail
        });


    if (!user) {

        throw createError(
            "Email ou mot de passe incorrect.",
            401
        );

    }


    /*
     * Un compte Google peut ne pas avoir de mot de passe.
     */

    if (!user.password) {

        throw createError(
            "Ce compte utilise la connexion Google.",
            401,
            "GOOGLE_ACCOUNT"
        );

    }


    const passwordMatch =
        await bcrypt.compare(
            password,
            user.password
        );


    if (!passwordMatch) {

        throw createError(
            "Email ou mot de passe incorrect.",
            401
        );

    }


    if (!user.isEmailVerified) {

        throw createError(
            "Veuillez confirmer votre adresse email avant de vous connecter.",
            403,
            "EMAIL_NOT_VERIFIED"
        );

    }


    const token =
        generateJWT(user);


    return {

        token,

        user:
            formatUser(user)

    };

};


// =====================================================
// GOOGLE LOGIN - REDIRECT
// =====================================================

const getGoogleAuthorizationUrl = () => {

    if (!GOOGLE_CLIENT_ID) {

        throw createError(
            "GOOGLE_CLIENT_ID n'est pas configuré.",
            500
        );

    }


    const params =
        new URLSearchParams({

            client_id:
                GOOGLE_CLIENT_ID,

            redirect_uri:
                GOOGLE_CALLBACK_URL,

            response_type:
                "code",

            scope:
                "openid email profile",

            access_type:
                "offline",

            prompt:
                "select_account"

        });


    return (
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        params.toString()
    );

};


// =====================================================
// GOOGLE TOKEN
// =====================================================

const exchangeGoogleCode = async (
    code
) => {

    if (!GOOGLE_CLIENT_ID) {

        throw createError(
            "GOOGLE_CLIENT_ID n'est pas configuré.",
            500
        );

    }


    if (!GOOGLE_CLIENT_SECRET) {

        throw createError(
            "GOOGLE_CLIENT_SECRET n'est pas configuré.",
            500
        );

    }


    const body =
        new URLSearchParams({

            code,

            client_id:
                GOOGLE_CLIENT_ID,

            client_secret:
                GOOGLE_CLIENT_SECRET,

            redirect_uri:
                GOOGLE_CALLBACK_URL,

            grant_type:
                "authorization_code"

        });


    const response =
        await fetch(
            "https://oauth2.googleapis.com/token",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/x-www-form-urlencoded"

                },

                body:
                    body.toString()

            }
        );


    if (!response.ok) {

        const text =
            await response.text();

        console.error(
            "GOOGLE TOKEN ERROR:",
            text
        );

        throw createError(
            "Impossible d'obtenir le token Google.",
            401,
            "GOOGLE_TOKEN_ERROR"
        );

    }


    return response.json();

};


// =====================================================
// GOOGLE USER
// =====================================================

const getGoogleUser = async (
    accessToken
) => {

    const response =
        await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {

                headers: {

                    Authorization:
                        `Bearer ${accessToken}`

                }

            }
        );


    if (!response.ok) {

        const text =
            await response.text();

        console.error(
            "GOOGLE USER ERROR:",
            text
        );

        throw createError(
            "Impossible de récupérer le profil Google.",
            401,
            "GOOGLE_USER_ERROR"
        );

    }


    return response.json();

};


// =====================================================
// GOOGLE LOGIN COMPLET
// =====================================================

const loginWithGoogle = async (
    code
) => {

    try {

        console.log(
            "🔐 GOOGLE OAUTH"
        );


        const googleTokens =
            await exchangeGoogleCode(
                code
            );


        console.log(
            "✅ TOKENS GOOGLE REÇUS"
        );


        const googleUser =
            await getGoogleUser(
                googleTokens.access_token
            );


        console.log(
            "GOOGLE USER :",
            googleUser
        );


        const normalizedEmail =
            googleUser.email
                .trim()
                .toLowerCase();


        const existingUser =
            await User.findOne({
                email: normalizedEmail
            });


        // =================================================
        // UTILISATEUR EXISTANT
        // =================================================

        if (existingUser) {

            console.log(
                "✅ EMAIL GOOGLE EXISTE DÉJÀ"
            );


            /*
             * Si le compte existe déjà,
             * on se connecte directement.
             */

            existingUser.isEmailVerified =
                true;


            /*
             * On peut récupérer l'image Google
             * uniquement si l'utilisateur n'en possède pas.
             */

            if (
                !existingUser.profileImage &&
                googleUser.picture
            ) {

                existingUser.profileImage =
                    googleUser.picture;

            }


            await existingUser.save();


            const token =
                generateJWT(
                    existingUser
                );


            return {

                type:
                    "LOGIN",

                token,

                user:
                    formatUser(
                        existingUser
                    )

            };

        }


        // =================================================
        // NOUVEL UTILISATEUR
        // =================================================

        console.log(
            "🆕 NOUVEL EMAIL GOOGLE"
        );


        /*
         * IMPORTANT :
         *
         * On NE crée PAS le User maintenant.
         *
         * On crée uniquement un token temporaire.
         */


        const googleRegistrationToken =
            crypto
                .randomBytes(32)
                .toString("hex");


        const googleRegistrationExpires =
            new Date(
                Date.now() +
                15 * 60 * 1000
            );


        /*
         * Le token contient les informations Google.
         *
         * Pour un projet plus sécurisé,
         * on peut aussi utiliser Redis ou une collection dédiée.
         */


        const temporaryGoogleData = {

            token:
                googleRegistrationToken,

            email:
                normalizedEmail,

            firstname:
                googleUser.given_name ||
                "",

            lastname:
                googleUser.family_name ||
                "",

            picture:
                googleUser.picture ||
                "",

            googleId:
                googleUser.id,

            expiresAt:
                googleRegistrationExpires

        };


        /*
         * Stockage temporaire en mémoire.
         *
         * Pour le développement local c'est suffisant.
         */

        googlePendingRegistrations.set(
            googleRegistrationToken,
            temporaryGoogleData
        );


        return {

            type:
                "COMPLETE_PROFILE",

            registrationToken:
                googleRegistrationToken,

            googleUser: {

                email:
                    normalizedEmail,

                firstname:
                    googleUser.given_name ||
                    "",

                lastname:
                    googleUser.family_name ||
                    "",

                picture:
                    googleUser.picture ||
                    ""

            }

        };

    }

    catch (error) {

        console.error(
            "GOOGLE SERVICE ERROR:",
            error
        );


        if (error.statusCode) {
            throw error;
        }


        throw createError(
            "Impossible de finaliser la connexion Google.",
            500,
            "GOOGLE_LOGIN_ERROR"
        );

    }

};


// =====================================================
// GOOGLE PENDING REGISTRATIONS
// =====================================================

const googlePendingRegistrations =
    new Map();


// =====================================================
// NETTOYAGE DES TOKENS GOOGLE
// =====================================================

const cleanGooglePendingRegistrations = () => {

    const now =
        Date.now();


    for (
        const [
            token,
            data
        ]
        of googlePendingRegistrations
    ) {

        if (
            data.expiresAt.getTime() <
            now
        ) {

            googlePendingRegistrations.delete(
                token
            );

        }

    }

};


setInterval(
    cleanGooglePendingRegistrations,
    60 * 1000
);


// =====================================================
// FINALISER INSCRIPTION GOOGLE
// =====================================================

const completeGoogleRegistration =
    async (
        registrationToken,
        userData,
        profileImage = null
    ) => {

        if (
            !registrationToken ||
            !registrationToken.trim()
        ) {

            throw createError(
                "Token d'inscription Google manquant.",
                400
            );

        }


        const googleData =
            googlePendingRegistrations.get(
                registrationToken.trim()
            );


        if (!googleData) {

            throw createError(
                "La session Google est invalide ou expirée.",
                400,
                "GOOGLE_REGISTRATION_EXPIRED"
            );

        }


        if (
            googleData.expiresAt <
            new Date()
        ) {

            googlePendingRegistrations.delete(
                registrationToken.trim()
            );


            throw createError(
                "La session Google est expirée.",
                400,
                "GOOGLE_REGISTRATION_EXPIRED"
            );

        }


        const {

            birthdate,
            gender,
            mainActivity,
            country

        } = userData;


        // =================================================
        // VALIDATION
        // =================================================

        if (!birthdate) {

            throw createError(
                "La date de naissance est obligatoire."
            );

        }


        const birthDateObject =
            new Date(
                `${birthdate}T00:00:00`
            );


        if (
            Number.isNaN(
                birthDateObject.getTime()
            )
        ) {

            throw createError(
                "Date de naissance invalide."
            );

        }


        if (
            birthDateObject > new Date()
        ) {

            throw createError(
                "La date de naissance ne peut pas être dans le futur."
            );

        }


        const age =
            calculateAge(
                birthDateObject
            );


        if (age < 18) {

            throw createError(
                "L'inscription est réservée aux personnes âgées de 18 ans ou plus."
            );

        }


        const allowedGenders = [
            "homme",
            "femme",
            "non-binaire"
        ];


        if (!gender) {

            throw createError(
                "Le sexe est obligatoire."
            );

        }


        if (
            !allowedGenders.includes(
                gender
            )
        ) {

            throw createError(
                "Genre invalide."
            );

        }


        if (!mainActivity) {

            throw createError(
                "L'activité principale est obligatoire."
            );

        }


        if (!country) {

            throw createError(
                "Le pays est obligatoire."
            );

        }


        // =================================================
        // DOUBLE VÉRIFICATION EMAIL
        // =================================================

        const existingUser =
            await User.findOne({

                email:
                    googleData.email

            });


        if (existingUser) {

            googlePendingRegistrations.delete(
                registrationToken.trim()
            );


            const token =
                generateJWT(
                    existingUser
                );


            return {

                type:
                    "LOGIN",

                token,

                user:
                    formatUser(
                        existingUser
                    )

            };

        }


        // =================================================
        // MOT DE PASSE GOOGLE
        // =================================================

        /*
         * Le compte Google n'utilise pas
         * le mot de passe classique.
         *
         * Mais ton modèle User demande
         * actuellement password required.
         *
         * On génère donc un mot de passe
         * aléatoire et sécurisé.
         */

        const randomPassword =
            crypto
                .randomBytes(48)
                .toString("hex");


        const hashedPassword =
            await bcrypt.hash(
                randomPassword,
                12
            );


        // =================================================
        // IMAGE
        // =================================================

        let profileImagePath =
            googleData.picture ||
            null;


        if (profileImage) {

            profileImagePath =
                `/uploads/${profileImage.filename}`;

        }


        // =================================================
        // CRÉATION USER
        // =================================================

        const user =
            await User.create({

                firstname:
                    googleData.firstname,

                lastname:
                    googleData.lastname,

                email:
                    googleData.email,

                birthdate:
                    birthDateObject,

                password:
                    hashedPassword,

                gender,

                mainActivity,

                country,

                profileImage:
                    profileImagePath,

                role:
                    "user",

                /*
                 * Google a déjà vérifié l'adresse.
                 */

                isEmailVerified:
                    true,

                emailVerificationToken:
                    null,

                emailVerificationExpires:
                    null

            });


        console.log(
            "✅ COMPTE GOOGLE CRÉÉ"
        );


        googlePendingRegistrations.delete(
            registrationToken.trim()
        );


        const token =
            generateJWT(
                user
            );


        return {

            type:
                "LOGIN",

            token,

            user:
                formatUser(user)

        };

    };


// =====================================================
// VERIFY EMAIL
// =====================================================

const verifyEmail = async (
    verificationToken
) => {

    if (
        typeof verificationToken !== "string" ||
        !verificationToken.trim()
    ) {

        throw createError(
            "Token de vérification manquant."
        );

    }


    const user =
        await User.findOne({

            emailVerificationToken:
                verificationToken.trim()

        });


    if (!user) {

        throw createError(
            "Le lien de vérification est invalide ou expiré."
        );

    }


    if (
        user.isEmailVerified
    ) {

        return {

            id:
                user._id,

            email:
                user.email,

            isEmailVerified:
                true,

            alreadyVerified:
                true

        };

    }


    if (
        !user.emailVerificationExpires ||
        user.emailVerificationExpires <= new Date()
    ) {

        throw createError(
            "Le lien de vérification est expiré."
        );

    }


    user.isEmailVerified =
        true;

    user.emailVerificationToken =
        null;

    user.emailVerificationExpires =
        null;


    await user.save();


    return {

        id:
            user._id,

        email:
            user.email,

        isEmailVerified:
            true,

        alreadyVerified:
            false

    };

};


// =====================================================
// RESEND VERIFICATION
// =====================================================

const generateNewVerificationToken =
    async (
        email
    ) => {

        if (
            typeof email !== "string" ||
            !email.trim()
        ) {

            throw createError(
                "L'adresse email est obligatoire."
            );

        }


        const normalizedEmail =
            email
                .trim()
                .toLowerCase();


        const user =
            await User.findOne({
                email: normalizedEmail
            });


        if (!user) {
            return true;
        }


        if (user.isEmailVerified) {
            return true;
        }


        const token =
            crypto
                .randomBytes(32)
                .toString("hex");


        const expires =
            new Date(
                Date.now() +
                24 * 60 * 60 * 1000
            );


        user.emailVerificationToken =
            token;

        user.emailVerificationExpires =
            expires;


        await user.save();


        const verificationUrl =
            `${FRONTEND_URL}/verify-email/${token}`;


        await emailService.sendVerificationEmail({

            email:
                user.email,

            firstname:
                user.firstname,

            verificationUrl

        });


        return true;

    };


// =====================================================
// FORGOT PASSWORD
// =====================================================

const createPasswordResetToken =
    async (
        email
    ) => {

        const normalizedEmail =
            email
                .trim()
                .toLowerCase();


        const user =
            await User.findOne({
                email: normalizedEmail
            });


        if (!user) {
            return null;
        }


        const resetToken =
            crypto
                .randomBytes(32)
                .toString("hex");


        const resetTokenExpires =
            new Date(
                Date.now() +
                15 * 60 * 1000
            );


        user.resetPasswordToken =
            resetToken;

        user.resetPasswordExpires =
            resetTokenExpires;


        await user.save();


        const resetUrl =
            `${FRONTEND_URL}/reset-password/${resetToken}`;


        await emailService.sendPasswordResetEmail({

            email:
                user.email,

            firstname:
                user.firstname,

            resetUrl

        });


        return true;

    };


// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (
    resetToken,
    newPassword
) => {

    if (!resetToken) {

        throw createError(
            "Token de réinitialisation manquant."
        );

    }


    if (!newPassword) {

        throw createError(
            "Le nouveau mot de passe est obligatoire."
        );

    }


    if (newPassword.length < 8) {

        throw createError(
            "Le nouveau mot de passe doit contenir au moins 8 caractères."
        );

    }


    const user =
        await User.findOne({

            resetPasswordToken:
                resetToken.trim(),

            resetPasswordExpires: {
                $gt: new Date()
            }

        });


    if (!user) {

        throw createError(
            "Le lien de réinitialisation est invalide ou expiré."
        );

    }


    user.password =
        await bcrypt.hash(
            newPassword,
            12
        );


    user.resetPasswordToken =
        null;

    user.resetPasswordExpires =
        null;


    await user.save();


    return true;

};


// =====================================================
// CURRENT USER
// =====================================================

const getCurrentUser = async (
    userId
) => {

    const user =
        await User.findById(
            userId
        ).select("-password");


    if (!user) {

        throw createError(
            "Utilisateur introuvable.",
            404,
            "USER_NOT_FOUND"
        );

    }


    return user;

};


// =====================================================
// EXPORT
// =====================================================

export default {

    register,

    login,

    getGoogleAuthorizationUrl,

    loginWithGoogle,

    completeGoogleRegistration,

    verifyEmail,

    generateNewVerificationToken,

    createPasswordResetToken,

    resetPassword,

    getCurrentUser

};