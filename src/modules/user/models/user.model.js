import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // =====================================================
        // INFORMATIONS PERSONNELLES
        // =====================================================

        firstname: {
            type: String,
            required: true,
            trim: true
        },

        lastname: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        birthdate: {
            type: Date,
            required: true
        },

        // =====================================================
        // MOT DE PASSE
        // =====================================================

        password: {
            type: String,
            required: true
        },

        // =====================================================
        // GENRE
        // =====================================================

        gender: {
            type: String,
            enum: {
                values: [
                    "homme",
                    "femme",
                    "autre"
                ],
                message: "Genre invalide."
            },
            required: true
        },

        // =====================================================
        // ACTIVITÉ PRINCIPALE
        // =====================================================

        mainActivity: {
            type: String,
            required: true,
            trim: true
        },

        // =====================================================
        // PAYS
        // =====================================================

        country: {
            type: String,
            required: true,
            trim: true
        },

        // =====================================================
        // ROLE
        // =====================================================

        role: {
            type: String,
            enum: [
                "user",
                "admin"
            ],
            default: "user"
        },

        // =====================================================
        // EMAIL VERIFICATION
        // =====================================================

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        emailVerificationToken: {
            type: String,
            default: null
        },

        emailVerificationExpires: {
            type: Date,
            default: null
        },

        // =====================================================
        // RESET PASSWORD
        // =====================================================

        resetPasswordToken: {
            type: String,
            default: null
        },

        resetPasswordExpires: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model(
    "User",
    userSchema
);

export default User;