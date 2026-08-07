import Profile from "./profile.model.js";




// ===============================
// GET PROFILE
// ===============================

const getProfileByUser = async(userId)=>{


const profile = await Profile.findOne({

    user:userId

})
.populate({

    path:"user",

    select:"username email"

});



return profile;


};









// ===============================
// UPDATE PROFILE
// ===============================


const updateProfile = async(
userId,
data
)=>{


const profile = await Profile.findOneAndUpdate(

{


user:userId


},


{


$set:data


},


{


new:true


}


);





if(!profile){


throw new Error(
"Profil introuvable"
);


}





return await Profile.findById(profile._id)

.populate({

path:"user",

select:"username email"

});


};








export default {


getProfileByUser,

updateProfile


};