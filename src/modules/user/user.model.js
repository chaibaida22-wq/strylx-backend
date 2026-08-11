import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {

        // =================================
        // INFORMATIONS UTILISATEUR
        // =================================

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


        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },


        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },


        password: {
            type: String,
            required: true
        },


        // =================================
        // ROLE
        // =================================

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },


        // =================================
        // PROFIL
        // =================================

        avatar: {
            type: String,
            default: ""
        },


        // =================================
        // VERIFICATION
        // =================================

        isVerified: {
            type: Boolean,
            default: false
        },


        // =================================
        // ARCHIVAGE
        // =================================

        isArchived: {
            type: Boolean,
            default: false
        },


        archivedAt: {
            type: Date,
            default: null
        },


        archivedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }

    },

    {
        timestamps: true
    }
);


export default mongoose.model(
    "User",
    userSchema
);