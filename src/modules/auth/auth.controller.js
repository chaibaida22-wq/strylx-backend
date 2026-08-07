import authService from "./auth.service.js";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import User from "../user/user.model.js";





// =====================
// REGISTER
// =====================


const register = async(req,res)=>{


try{


const user =

await authService.register(

req.body

);




res.status(201).json({

success:true,

message:"Compte créé avec succès",

user

});



}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}



};









// =====================
// LOGIN
// =====================


const login = async(req,res)=>{


try{


const {

email,

password

}=req.body;





const user =

await User.findOne({

email

});






if(!user){


return res.status(404).json({

success:false,

message:"Utilisateur introuvable."

});


}






const match =

await bcrypt.compare(

password,

user.password

);





if(!match){


return res.status(400).json({

success:false,

message:"Mot de passe incorrect."

});


}







const token = jwt.sign(

{

id:user._id,

role:user.role

},

process.env.JWT_SECRET,

{

expiresIn:"7d"

}

);







res.json({

success:true,

token,

user:{

id:user._id,

username:user.username,

email:user.email,

role:user.role

}

});




}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};







export default {


register,

login


};