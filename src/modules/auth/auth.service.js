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
// REGISTER
// =====================================================

const register = async (userData) => {

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


    // =================================================
    // VALIDATION
    // =================================================

    if (
        typeof firstname !== "string" ||
        !firstname.trim()
    ) {
        throw createError(
            "Le prénom est obligatoire.",
            400
        );
    }


    if (
        typeof lastname !== "string" ||
        !lastname.trim()
    ) {
        throw createError(
            "Le nom est obligatoire.",
            400
        );
    }


    if (
        typeof email !== "string" ||
        !email.trim()
    ) {
        throw createError(
            "L'adresse email est obligatoire.",
            400
        );
    }


    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email.trim())) {

        throw createError(
            "L'adresse email n'est pas valide.",
            400
        );

    }


    if (!password) {

        throw createError(
            "Le mot de passe est obligatoire.",
            400
        );

    }


    if (password.length < 8) {

        throw createError(
            "Le mot de passe doit contenir au moins 8 caractères.",
            400
        );

    }


    if (
        !confirmPassword ||
        password !== confirmPassword
    ) {

        throw createError(
            "Les mots de passe ne correspondent pas.",
            400
        );

    }


    if (!birthdate) {

        throw createError(
            "La date de naissance est obligatoire.",
            400
        );

    }


    if (!gender) {

        throw createError(
            "Le sexe est obligatoire.",
            400
        );

    }


    if (!mainActivity) {

        throw createError(
            "L'activité principale est obligatoire.",
            400
        );

    }


    if (!country) {

        throw createError(
            "Le pays est obligatoire.",
            400
        );

    }


    // =================================================
    // NORMALISATION
    // =================================================

    const normalizedEmail =
        email
            .trim()
            .toLowerCase();

    const normalizedFirstname =
        firstname.trim();

    const normalizedLastname =
        lastname.trim();


    // =================================================
    // USER EXISTANT
    // =================================================

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


        // Si le compte existe mais n'est pas vérifié,
        // on génère un nouveau token.

        const verificationToken =
            crypto
                .randomBytes(32)
                .toString("hex");

        const verificationExpires =
            new Date(
                Date.now() +
                24 * 60 * 60 * 1000
            );


        existingUser.emailVerificationToken =
            verificationToken;

        existingUser.emailVerificationExpires =
            verificationExpires;


        await existingUser.save();


        const verificationUrl =
            `${FRONTEND_URL}/verify-email/${verificationToken}`;


        console.log("=================================");
        console.log("🔄 NOUVEAU TOKEN");
        console.log("EMAIL :", normalizedEmail);
        console.log("TOKEN :", verificationToken);
        console.log("URL :", verificationUrl);
        console.log("EXPIRE :", verificationExpires);
        console.log("=================================");


        try {

            await emailService.sendVerificationEmail({

                email: existingUser.email,

                firstname: existingUser.firstname,

                verificationUrl

            });

        } catch (emailError) {

            console.error(
                "❌ ERREUR ENVOI EMAIL :",
                emailError
            );

            throw createError(
                "Impossible d'envoyer l'email de vérification.",
                500
            );

        }


        return {

            message:
                "Un nouveau lien de vérification a été envoyé à votre adresse email.",

            user: {

                id: existingUser._id,

                firstname: existingUser.firstname,

                lastname: existingUser.lastname,

                email: existingUser.email,

                isEmailVerified:
                    existingUser.isEmailVerified

            }

        };

    }


    // =================================================
    // DATE NAISSANCE
    // =================================================

    const birthDateObject =
        new Date(`${birthdate}T00:00:00`);


    if (
        Number.isNaN(
            birthDateObject.getTime()
        )
    ) {

        throw createError(
            "Date de naissance invalide.",
            400
        );

    }


    if (
        birthDateObject > new Date()
    ) {

        throw createError(
            "La date de naissance ne peut pas être dans le futur.",
            400
        );

    }


    // =================================================
    // AGE
    // =================================================

    const age =
        calculateAge(
            birthDateObject
        );


    if (age < 18) {

        throw createError(
            "L'inscription est réservée aux personnes âgées de 18 ans ou plus.",
            400
        );

    }


    // =================================================
    // PASSWORD HASH
    // =================================================

    const hashedPassword =
        await bcrypt.hash(
            password,
            12
        );


    // =================================================
    // VERIFICATION TOKEN
    // =================================================

    const emailVerificationToken =
        crypto
            .randomBytes(32)
            .toString("hex");


    const emailVerificationExpires =
        new Date(
            Date.now() +
            24 * 60 * 60 * 1000
        );


    console.log("=================================");
    console.log("🔐 NOUVEAU TOKEN VERIFICATION");
    console.log("EMAIL :", normalizedEmail);
    console.log("TOKEN :", emailVerificationToken);
    console.log(
        "EXPIRE :",
        emailVerificationExpires
    );
    console.log("=================================");


    // =================================================
    // CREATE USER
    // =================================================

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

            role:
                "user",

            isEmailVerified:
                false,

            emailVerificationToken,

            emailVerificationExpires

        });


    // =================================================
    // VERIFICATION URL
    // =================================================

    const verificationUrl =
        `${FRONTEND_URL}/verify-email/${emailVerificationToken}`;


    console.log("=================================");
    console.log("📩 VERIFICATION URL");
    console.log(verificationUrl);
    console.log("=================================");


    // =================================================
    // SEND EMAIL
    // =================================================

    try {

        await emailService.sendVerificationEmail({

            email:
                user.email,

            firstname:
                user.firstname,

            verificationUrl

        });


        console.log(
            "✅ EMAIL ENVOYÉ À :",
            user.email
        );


    } catch (emailError) {

        console.error(
            "❌ EMAIL VERIFICATION ERROR :",
            emailError
        );


        // On supprime le compte si l'email
        // n'a pas pu être envoyé.

        await User.findByIdAndDelete(
            user._id
        );


        throw createError(
            "Impossible d'envoyer l'email de vérification.",
            500
        );

    }


    // =================================================
    // RESPONSE
    // =================================================

    return {

        message:
            "Compte créé avec succès. Un email de vérification vous a été envoyé.",

        user: {

            id:
                user._id,

            firstname:
                user.firstname,

            lastname:
                user.lastname,

            email:
                user.email,

            birthdate:
                user.birthdate,

            gender:
                user.gender,

            mainActivity:
                user.mainActivity,

            country:
                user.country,

            role:
                user.role,

            isEmailVerified:
                user.isEmailVerified

        }

    };

};


// =====================================================
// LOGIN
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
            "L'adresse email est obligatoire.",
            400
        );

    }


    if (!password) {

        throw createError(
            "Le mot de passe est obligatoire.",
            400
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


    if (!JWT_SECRET) {

        throw createError(
            "JWT_SECRET n'est pas configuré.",
            500
        );

    }


    const token =
        jwt.sign(

            {
                id:
                    user._id.toString(),

                role:
                    user.role

            },

            JWT_SECRET,

            {
                expiresIn:
                    JWT_EXPIRES_IN
            }

        );


    return {

        token,

        user: {

            id:
                user._id,

            firstname:
                user.firstname,

            lastname:
                user.lastname,

            email:
                user.email,

            birthdate:
                user.birthdate,

            gender:
                user.gender,

            mainActivity:
                user.mainActivity,

            country:
                user.country,

            role:
                user.role,

            isEmailVerified:
                user.isEmailVerified

        }

    };

};
// =====================================================
// VERIFY EMAIL
// =====================================================

const verifyEmail = async (verificationToken) => {

    // =================================================
    // VALIDATION
    // =================================================

    if (
        typeof verificationToken !== "string" ||
        !verificationToken.trim()
    ) {

        throw createError(
            "Token de vérification manquant.",
            400,
            "MISSING_VERIFICATION_TOKEN"
        );
    }


    // =================================================
    // NETTOYAGE
    // =================================================

    const token = verificationToken.trim();


    console.log("=================================");
    console.log("📩 VERIFY EMAIL SERVICE");
    console.log("TOKEN REÇU :", token);
    console.log("TOKEN LENGTH :", token.length);
    console.log("=================================");


    // =================================================
    // RECHERCHE DU USER
    // =================================================

    const user = await User.findOne({
        emailVerificationToken: token
    });


    // =================================================
    // TOKEN INTROUVABLE
    // =================================================

    if (!user) {

        console.error("=================================");
        console.error("❌ INVALID VERIFICATION TOKEN");
        console.error("TOKEN :", token);
        console.error("=================================");

        throw createError(
            "Le lien de vérification est invalide ou expiré.",
            400,
            "INVALID_VERIFICATION_TOKEN"
        );
    }


    // =================================================
    // DEBUG
    // =================================================

    console.log("=================================");
    console.log("✅ USER TROUVÉ");
    console.log("ID :", user._id);
    console.log("EMAIL :", user.email);
    console.log(
        "TOKEN DB :",
        user.emailVerificationToken
    );
    console.log(
        "TOKEN DB LENGTH :",
        user.emailVerificationToken
            ? user.emailVerificationToken.length
            : 0
    );
    console.log(
        "EXPIRES :",
        user.emailVerificationExpires
    );
    console.log(
        "VERIFIED :",
        user.isEmailVerified
    );
    console.log("=================================");


    // =================================================
    // DEJA VERIFIE
    // =================================================
    //
    // IMPORTANT :
    // On vérifie AVANT l'expiration.
    //
    // Cela permet à un deuxième appel du frontend
    // de recevoir une réponse SUCCESS au lieu de
    // INVALID_VERIFICATION_TOKEN.
    // =================================================

    if (user.isEmailVerified === true) {

        console.log(
            "ℹ️ EMAIL DÉJÀ VÉRIFIÉ :",
            user.email
        );

        return {

            id: user._id,

            email: user.email,

            isEmailVerified: true,

            alreadyVerified: true

        };
    }


    // =================================================
    // TOKEN EXPIRÉ
    // =================================================

    if (
        !user.emailVerificationExpires ||
        user.emailVerificationExpires <= new Date()
    ) {

        console.error(
            "❌ TOKEN EXPIRED"
        );

        throw createError(
            "Le lien de vérification est expiré.",
            400,
            "EMAIL_VERIFICATION_EXPIRED"
        );
    }


    // =================================================
    // VALIDATION EMAIL
    // =================================================

    user.isEmailVerified = true;


    // =================================================
    // IMPORTANT
    // =================================================
    //
    // NE PAS SUPPRIMER IMMÉDIATEMENT :
    //
    // user.emailVerificationToken = null;
    //
    // Sinon React StrictMode peut provoquer :
    //
    // premier appel  -> SUCCESS
    // deuxième appel -> INVALID TOKEN
    //
    // Le token expirera naturellement après 24h.
    // =================================================


    await user.save();


    // =================================================
    // SUCCESS
    // =================================================

    console.log("=================================");
    console.log("✅ EMAIL VERIFIED SUCCESSFULLY");
    console.log("EMAIL :", user.email);
    console.log("=================================");


    return {

        id: user._id,

        email: user.email,

        isEmailVerified: true,

        alreadyVerified: false

    };
};
// =====================================================
// RESEND VERIFICATION
// =====================================================

const generateNewVerificationToken =
    async (email) => {

        if (
            typeof email !== "string" ||
            !email.trim()
        ) {

            throw createError(
                "L'adresse email est obligatoire.",
                400
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


        // Ne pas révéler si l'utilisateur existe
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


        console.log("=================================");
        console.log("🔄 RESEND VERIFICATION");
        console.log("EMAIL :", user.email);
        console.log("TOKEN :", token);
        console.log("URL :", verificationUrl);
        console.log("=================================");


        try {

            await emailService.sendVerificationEmail({

                email:
                    user.email,

                firstname:
                    user.firstname,

                verificationUrl

            });

        } catch (error) {

            console.error(
                "❌ RESEND EMAIL ERROR :",
                error
            );

            throw createError(
                "Impossible d'envoyer l'email de vérification.",
                500
            );

        }


        return true;

    };


// =====================================================
// FORGOT PASSWORD
// =====================================================

const createPasswordResetToken =
    async (email) => {

        if (
            typeof email !== "string" ||
            !email.trim()
        ) {

            throw createError(
                "L'adresse email est obligatoire.",
                400
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

    if (
        typeof resetToken !== "string" ||
        !resetToken.trim()
    ) {

        throw createError(
            "Token de réinitialisation manquant.",
            400
        );

    }


    if (!newPassword) {

        throw createError(
            "Le nouveau mot de passe est obligatoire.",
            400
        );

    }


    if (newPassword.length < 8) {

        throw createError(
            "Le nouveau mot de passe doit contenir au moins 8 caractères.",
            400
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
            "Le lien de réinitialisation est invalide ou expiré.",
            400
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
// EXPORT
// =====================================================

export default {

    register,

    login,

    verifyEmail,

    generateNewVerificationToken,

    createPasswordResetToken,

    resetPassword

};