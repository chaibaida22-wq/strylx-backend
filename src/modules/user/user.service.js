import User from "./user.model.js";

const getAllUsers = async()=>{

    return await User.find().select("-password");

};

const getUserById = async(id)=>{

    return await User.findById(id).select("-password");

};

const updateUser = async(id,data)=>{

    return await User.findByIdAndUpdate(
        id,
        data,
        {new:true}
    ).select("-password");

};

const deleteUser = async(id)=>{

    return await User.findByIdAndDelete(id);

};

export default{

    getAllUsers,
    getUserById,
    updateUser,
    deleteUser

};