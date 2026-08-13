import jwt from "jsonwebtoken";
import crypto from "crypto";

// =====================================================
// JWT SECRET
// =====================================================

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.warn(
        "⚠️ JWT_SECRET n'est pas défini dans le fichier .env"
    );
}


// =====================================================
// GÉNÉRER UN TOKEN JWT
// =====================================================

const generateToken = (user) => {

    if (!JWT_SECRET) {
        throw new Error(
            "JWT_SECRET est manquant dans le fichier .env."
        );
    }

    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },

        JWT_SECRET,

        {
            expiresIn: "7d"
        }
    );
};


// =====================================================
// VÉRIFIER UN TOKEN JWT
// =====================================================

const verifyToken = (token) => {

    if (!JWT_SECRET) {
        throw new Error(
            "JWT_SECRET est manquant dans le fichier .env."
        );
    }

    return jwt.verify(
        token,
        JWT_SECRET
    );
};


// =====================================================
// GÉNÉRER UN TOKEN ALÉATOIRE
// Utilisé pour :
// - confirmation email
// - mot de passe oublié
// =====================================================

const generateRandomToken = () => {

    return crypto
        .randomBytes(32)
        .toString("hex");

};


// =====================================================
// HASHER UN TOKEN
// On ne stocke pas directement le token
// sensible en base de données.
// =====================================================

const hashToken = (token) => {

    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

};


// =====================================================
// DATE D'EXPIRATION D'UN TOKEN
// Exemple : 24 heures
// =====================================================

const getTokenExpiration = (
    hours = 24
) => {

    return new Date(
        Date.now() +
        hours * 60 * 60 * 1000
    );

};


// =====================================================
// TOKEN DE CONFIRMATION EMAIL
// =====================================================

const generateEmailVerificationToken = () => {

    const token =
        generateRandomToken();

    const hashedToken =
        hashToken(token);

    const expiresAt =
        getTokenExpiration(24);

    return {

        token,

        hashedToken,

        expiresAt

    };

};


// =====================================================
// TOKEN MOT DE PASSE OUBLIÉ
// =====================================================

const generatePasswordResetToken = () => {

    const token =
        generateRandomToken();

    const hashedToken =
        hashToken(token);

    const expiresAt =
        getTokenExpiration(1);

    return {

        token,

        hashedToken,

        expiresAt

    };

};


// =====================================================
// EXPORT
// =====================================================

export default {

    generateToken,

    verifyToken,

    generateRandomToken,

    hashToken,

    getTokenExpiration,

    generateEmailVerificationToken,

    generatePasswordResetToken

};