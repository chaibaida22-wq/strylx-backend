import User from "./models/user.model.js";

// =====================================================
// CHAMPS SENSIBLES À NE JAMAIS RETOURNER
// =====================================================

const SAFE_USER_FIELDS =
    "-password " +
    "-emailVerificationToken " +
    "-emailVerificationExpires " +
    "-resetPasswordToken " +
    "-resetPasswordExpires";

// =====================================================
// GET ALL USERS
// =====================================================

const getAllUsers = async () => {

    const users =
        await User.find()
            .select(SAFE_USER_FIELDS)
            .sort({
                createdAt: -1
            });

    return users;
};

// =====================================================
// GET USER BY ID
// =====================================================

const getUserById = async (id) => {

    const user =
        await User.findById(id)
            .select(SAFE_USER_FIELDS);

    if (!user) {

        const error =
            new Error(
                "Utilisateur introuvable."
            );

        error.statusCode = 404;

        throw error;
    }

    return user;
};

// =====================================================
// GET USER BY EMAIL
// =====================================================

const getUserByEmail = async (email) => {

    if (
        typeof email !== "string" ||
        !email.trim()
    ) {

        const error =
            new Error(
                "Adresse email invalide."
            );

        error.statusCode = 400;

        throw error;
    }

    const normalizedEmail =
        email.trim().toLowerCase();

    const user =
        await User.findOne({
            email: normalizedEmail
        })
        .select(SAFE_USER_FIELDS);

    if (!user) {

        const error =
            new Error(
                "Utilisateur introuvable."
            );

        error.statusCode = 404;

        throw error;
    }

    return user;
};

// =====================================================
// UPDATE USER
// =====================================================

const updateUser = async (
    id,
    data
) => {

    if (!data || typeof data !== "object") {

        const error =
            new Error(
                "Données de modification invalides."
            );

        error.statusCode = 400;

        throw error;
    }

    // =================================================
    // CHAMPS AUTORISÉS
    // =================================================

    const allowedFields = {

        firstname:
            data.firstname,

        lastname:
            data.lastname,

        gender:
            data.gender,

        mainActivity:
            data.mainActivity,

        country:
            data.country,

        username:
            data.username,

        secondaryActivities:
            data.secondaryActivities,

        equipment:
            data.equipment,

        avatar:
            data.avatar
    };

    // =================================================
    // SUPPRIMER LES undefined
    // =================================================

    Object.keys(
        allowedFields
    ).forEach((key) => {

        if (
            allowedFields[key] === undefined
        ) {

            delete allowedFields[key];

        }

    });

    // =================================================
    // NORMALISATION
    // =================================================

    if (
        allowedFields.firstname !== undefined &&
        typeof allowedFields.firstname === "string"
    ) {

        allowedFields.firstname =
            allowedFields.firstname.trim();

    }

    if (
        allowedFields.lastname !== undefined &&
        typeof allowedFields.lastname === "string"
    ) {

        allowedFields.lastname =
            allowedFields.lastname.trim();

    }

    if (
        allowedFields.username !== undefined &&
        typeof allowedFields.username === "string"
    ) {

        allowedFields.username =
            allowedFields.username.trim();

    }

    // =================================================
    // UPDATE
    // =================================================

    const user =
        await User.findByIdAndUpdate(
            id,
            {
                $set: allowedFields
            },
            {
                new: true,
                runValidators: true
            }
        )
        .select(SAFE_USER_FIELDS);

    // =================================================
    // USER INTROUVABLE
    // =================================================

    if (!user) {

        const error =
            new Error(
                "Utilisateur introuvable."
            );

        error.statusCode = 404;

        throw error;
    }

    return user;
};

// =====================================================
// DELETE USER
// =====================================================

const deleteUser = async (id) => {

    const user =
        await User.findByIdAndDelete(id);

    if (!user) {

        const error =
            new Error(
                "Utilisateur introuvable."
            );

        error.statusCode = 404;

        throw error;
    }

    return user;
};

// =====================================================
// COUNT USERS
// =====================================================

const countUsers = async () => {

    const count =
        await User.countDocuments();

    return count;
};

// =====================================================
// EXPORT
// =====================================================

export default {

    getAllUsers,

    getUserById,

    getUserByEmail,

    updateUser,

    deleteUser,

    countUsers

};