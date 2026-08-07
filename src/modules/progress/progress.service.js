import Progress from "./progress.model.js";




// ===============================
// GET USER PROGRESS
// ===============================


const getProgress = async(userId)=>{


let progress = await Progress.findOne({

    user:userId

})
.populate("badges");





// création automatique

if(!progress){


progress = await Progress.create({

    user:userId

});


}



return progress;


};









// ===============================
// ADD XP
// ===============================


const addXP = async(
userId,
amount
)=>{


let progress = await Progress.findOne({

    user:userId

});




if(!progress){


progress = await Progress.create({

    user:userId

});


}






// ajout XP

progress.xp += amount;






// calcul niveau

progress.level =

Math.floor(
progress.xp / 100
)+1;







// calcul progression niveau

const xpInLevel = progress.xp % 100;



progress.progressPercentage =

xpInLevel;







await progress.save();





return progress;


};









// ===============================
// COMPLETE CHALLENGE
// ===============================


const completeChallenge = async(userId)=>{


const progress =

await Progress.findOne({

user:userId

});




if(!progress){


throw new Error(
"Progression inexistante"
);

}





progress.completedChallenges +=1;



progress.xp +=50;





progress.level =

Math.floor(

progress.xp /100

)+1;





progress.progressPercentage =

progress.xp %100;







await progress.save();





return progress;


};







export default {


getProgress,

addXP,

completeChallenge


};