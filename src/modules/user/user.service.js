import User from "./user.model.js";


// =================================
// GET ALL USERS
// =================================

const getAllUsers = async (includeArchived = false) => {

    const filter = {};

    if (!includeArchived) {
        filter.isArchived = false;
    }

    return await User
        .find(filter)
        .select("-password")
        .sort({
            createdAt: -1
        });
};


// =================================
// GET USER BY ID
// =================================

const getUserById = async (id) => {

    return await User
        .findById(id)
        .select("-password");
};


// =================================
// UPDATE USER
// =================================

const updateUser = async (id, data) => {

    return await User
        .findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true
            }
        )
        .select("-password");
};


// =================================
// ARCHIVE USER
// =================================

const deleteUser = async (id, archivedBy = null) => {

    return await User.findByIdAndUpdate(

        id,

        {
            isArchived: true,
            archivedAt: new Date(),
            archivedBy: archivedBy
        },

        {
            new: true
        }

    ).select("-password");
};


// =================================
// RESTORE USER
// =================================

const restoreUser = async (id) => {

    return await User.findByIdAndUpdate(

        id,

        {
            isArchived: false,
            archivedAt: null,
            archivedBy: null
        },

        {
            new: true
        }

    ).select("-password");
};


// =================================
// GET ARCHIVED USERS
// =================================

const getArchivedUsers = async () => {

    return await User
        .find({
            isArchived: true
        })
        .select("-password")
        .sort({
            archivedAt: -1
        });
};


export default {

    getAllUsers,

    getUserById,

    updateUser,

    deleteUser,

    restoreUser,

    getArchivedUsers

};