import userService
    from "../user.service.js";


// =====================================================
// GET ALL USERS
// =====================================================

const getUsers = async (
    req,
    res
) => {

    try {

        const users =
            await userService.getAllUsers();


        res.status(200).json({

            success: true,

            count: users.length,

            users

        });

    }

    catch (error) {

        console.error(
            "Erreur getUsers :",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// =====================================================
// GET USER BY ID
// =====================================================

const getUser = async (
    req,
    res
) => {

    try {

        const user =
            await userService.getUserById(
                req.params.id
            );


        res.status(200).json({

            success: true,

            user

        });

    }

    catch (error) {

        console.error(
            "Erreur getUser :",
            error
        );


        res.status(404).json({

            success: false,

            message:
                error.message

        });

    }

};


// =====================================================
// GET USER BY EMAIL
// =====================================================

const getUserByEmail = async (
    req,
    res
) => {

    try {

        const user =
            await userService.getUserByEmail(
                req.params.email
            );


        res.status(200).json({

            success: true,

            user

        });

    }

    catch (error) {

        res.status(404).json({

            success: false,

            message:
                error.message

        });

    }

};


// =====================================================
// UPDATE USER
// =====================================================

const updateUser = async (
    req,
    res
) => {

    try {

        const user =
            await userService.updateUser(
                req.params.id,
                req.body
            );


        res.status(200).json({

            success: true,

            message:
                "Utilisateur modifié avec succès.",

            user

        });

    }

    catch (error) {

        console.error(
            "Erreur updateUser :",
            error
        );


        res.status(400).json({

            success: false,

            message:
                error.message

        });

    }

};


// =====================================================
// DELETE USER
// =====================================================

const deleteUser = async (
    req,
    res
) => {

    try {

        await userService.deleteUser(
            req.params.id
        );


        res.status(200).json({

            success: true,

            message:
                "Utilisateur supprimé avec succès."

        });

    }

    catch (error) {

        console.error(
            "Erreur deleteUser :",
            error
        );


        res.status(404).json({

            success: false,

            message:
                error.message

        });

    }

};


// =====================================================
// COUNT USERS
// =====================================================

const countUsers = async (
    req,
    res
) => {

    try {

        const count =
            await userService.countUsers();


        res.status(200).json({

            success: true,

            count

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


export default {

    getUsers,

    getUser,

    getUserByEmail,

    updateUser,

    deleteUser,

    countUsers

};