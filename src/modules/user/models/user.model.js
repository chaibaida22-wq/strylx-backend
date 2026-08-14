import mongoose from "mongoose";


// =====================================================
// USER SCHEMA
// =====================================================

const userSchema = new mongoose.Schema(

    {

        // =================================================
        // IDENTITÉ
        // =================================================

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


        // =================================================
        // AUTHENTIFICATION
        // =================================================

        password: {
            type: String,
            required: false,
            default: null
        },

        provider: {
            type: String,
            enum: [
                "local",
                "google",
                "apple"
            ],
            default: "local"
        },

        googleId: {
            type: String,
            default: null
        },

        appleId: {
            type: String,
            default: null
        },


        // =================================================
        // INFORMATIONS PERSONNELLES
        // =================================================

        birthdate: {
            type: Date,
            required: false,
            default: null
        },

        gender: {
            type: String,
            enum: [
                "homme",
                "femme",
                "non-binaire"
            ],
            required: false,
            default: null
        },

        mainActivity: {
            type: String,
            required: false,
            default: null
        },

        country: {
            type: String,
            required: false,
            default: null
        },


        // =================================================
        // IMAGE
        // =================================================

        profileImage: {
            type: String,
            default: null
        },


        // =================================================
        // ROLE
        // =================================================

        role: {
            type: String,
            enum: [
                "user",
                "admin"
            ],
            default: "user"
        },


        // =================================================
        // EMAIL VERIFICATION
        // =================================================

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


        // =================================================
        // PASSWORD RESET
        // =================================================

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


// =====================================================
// INDEX GOOGLE
// =====================================================

userSchema.index(
    { googleId: 1 },
    {
        unique: true,
        sparse: true
    }
);


// =====================================================
// INDEX APPLE
// =====================================================

userSchema.index(
    { appleId: 1 },
    {
        unique: true,
        sparse: true
    }
);


// =====================================================
// MODEL
// =====================================================

const User =
    mongoose.model(
        "User",
        userSchema
    );


export default User;