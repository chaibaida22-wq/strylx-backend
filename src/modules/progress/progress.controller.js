import progressService from "./progress.service.js";




// ===============================
// GET PROGRESS
// ===============================


const getProgress = async(req,res)=>{


try{


const progress =

await progressService.getProgress(

req.user.id

);




res.json({

success:true,

progress

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
// ADD XP
// ===============================


const addXP = async(req,res)=>{


try{


const progress =

await progressService.addXP(

req.user.id,

Number(req.body.amount)

);





res.json({

success:true,

message:"XP ajoutée",

progress

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
// COMPLETE CHALLENGE
// ===============================


const completeChallenge = async(req,res)=>{


try{


const progress =

await progressService.completeChallenge(

req.user.id

);





res.json({

success:true,

message:"Défi terminé",

progress

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


getProgress,

addXP,

completeChallenge


};