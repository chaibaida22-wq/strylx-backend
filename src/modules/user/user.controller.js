import userService from "./user.service.js";


// =================================
// GET USERS
// =================================

const getUsers = async (req, res) => {

    try {

        const includeArchived =
            req.query.archived === "true";


        const users =
            await userService.getAllUsers(
                includeArchived
            );


        res.status(200).json({

            success: true,

            count: users.length,

            users

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =================================
// GET USER
// =================================

const getUser = async (req, res) => {

    try {

        const user =
            await userService.getUserById(
                req.params.id
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "Utilisateur introuvable"

            });

        }


        res.status(200).json({

            success: true,

            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =================================
// UPDATE USER
// =================================

const updateUser = async (req, res) => {

    try {

        const user =
            await userService.updateUser(
                req.params.id,
                req.body
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "Utilisateur introuvable"

            });

        }


        res.status(200).json({

            success: true,

            message: "Utilisateur modifié avec succès",

            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =================================
// ARCHIVE USER
// =================================

const deleteUser = async (req, res) => {

    try {

        const user =
            await userService.deleteUser(
                req.params.id
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "Utilisateur introuvable"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Utilisateur archivé avec succès",

            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =================================
// RESTORE USER
// =================================

const restoreUser = async (req, res) => {

    try {

        const user =
            await userService.restoreUser(
                req.params.id
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "Utilisateur introuvable"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Utilisateur réactivé avec succès",

            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =================================
// GET ARCHIVED USERS
// =================================

const getArchivedUsers = async (req, res) => {

    try {

        const users =
            await userService.getArchivedUsers();


        res.status(200).json({

            success: true,

            count: users.length,

            users

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


export default {

    getUsers,

    getUser,

    updateUser,

    deleteUser,

    restoreUser,

    getArchivedUsers

};