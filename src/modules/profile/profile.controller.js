import profileService from "./profile.service.js";




// ===============================
// GET PROFILE
// ===============================

const getProfile = async(req,res)=>{


try{


const profile = 
await profileService.getProfileByUser(
req.user.id
);



res.json({

success:true,

profile

});


}


catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ===============================
// UPDATE PROFILE
// ===============================

const updateProfile = async(req,res)=>{


try{


const data={};





// =====================
// PERSONAL INFORMATION
// =====================


if(req.body.firstname)

data.firstname=req.body.firstname;



if(req.body.lastname)

data.lastname=req.body.lastname;





if(req.body.dateNaissance)

data.dateNaissance=req.body.dateNaissance;





if(req.body.bio !== undefined)

data.bio=req.body.bio;





if(req.body.ville !== undefined)

data.ville=req.body.ville;









// =====================
// SPORT INFORMATION
// =====================


if(req.body.disciplinePrincipale !== undefined)

{

data.disciplinePrincipale =
req.body.disciplinePrincipale;

}







if(req.body.sousDisciplines !== undefined)

{


data.sousDisciplines =

Array.isArray(req.body.sousDisciplines)

?

req.body.sousDisciplines

:

JSON.parse(
req.body.sousDisciplines
);


}









// =====================
// AVATAR
// =====================


if(req.file)

{


data.avatar =

"/uploads/" + req.file.filename;


}









const profile =

await profileService.updateProfile(

req.user.id,

data

);







res.json({

success:true,

message:"Profil modifié avec succès",

profile

});


}





catch(error){


console.log(error);



res.status(500).json({

success:false,

message:error.message

});


}



};








export default {


getProfile,

updateProfile


};