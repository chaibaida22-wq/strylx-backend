import userService from "./user.service.js";

const getUsers = async(req,res)=>{

    try{

        const users = await userService.getAllUsers();

        res.json(users);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const getUser = async(req,res)=>{

    try{

        const user = await userService.getUserById(req.params.id);

        if(!user){

            return res.status(404).json({
                message:"Utilisateur introuvable"
            });

        }

        res.json(user);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const updateUser = async(req,res)=>{

    try{

        const user = await userService.updateUser(
            req.params.id,
            req.body
        );

        res.json(user);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const deleteUser = async(req,res)=>{

    try{

        await userService.deleteUser(req.params.id);

        res.json({
            message:"Utilisateur supprimé"
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

export default{

    getUsers,
    getUser,
    updateUser,
    deleteUser

};