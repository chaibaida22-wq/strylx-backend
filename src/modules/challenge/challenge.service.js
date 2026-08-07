import Challenge from "./challenge.model.js";

import ChallengeParticipation from "./challengeParticipation.model.js";

import progressService from "../progress/progress.service.js";




// =================================
// GET ALL CHALLENGES
// =================================

const getChallenges = async()=>{


    return await Challenge.find({

        status:"active"

    })
    .populate(
        "createdBy",
        "username"
    );


};






// =================================
// GET ONE CHALLENGE
// =================================

const getChallengeById = async(id)=>{


    return await Challenge.findById(id);


};








// =================================
// CREATE CHALLENGE
// =================================

const createChallenge = async(data)=>{


    return await Challenge.create(data);


};









// =================================
// JOIN CHALLENGE
// =================================

const joinChallenge = async(
    userId,
    challengeId
)=>{


    const exist =

    await ChallengeParticipation.findOne({

        user:userId,

        challenge:challengeId

    });



    if(exist){

        throw new Error(
            "Vous participez déjà à ce challenge"
        );

    }



    return await ChallengeParticipation.create({

        user:userId,

        challenge:challengeId

    });



};









// =================================
// COMPLETE CHALLENGE
// =================================

const completeChallenge = async(
    userId,
    challengeId
)=>{


    const participation =

    await ChallengeParticipation.findOne({

        user:userId,

        challenge:challengeId

    })
    .populate("challenge");




    if(!participation){

        throw new Error(
            "Participation inexistante"
        );

    }



    participation.status="completed";

    participation.completedAt=new Date();



    await participation.save();





    // Ajouter XP automatiquement

    await progressService.addXP(

        userId,

        participation.challenge.xpReward

    );




    return participation;


};






export default {


    getChallenges,

    getChallengeById,

    createChallenge,

    joinChallenge,

    completeChallenge

};