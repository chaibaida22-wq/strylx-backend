import challengeService from "./challenge.service.js";




// GET ALL

const getChallenges = async(req,res)=>{

    try{


        const challenges =
        await challengeService.getChallenges();



        res.json({

            success:true,

            challenges

        });


    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};






// CREATE

const createChallenge = async(req,res)=>{


    try{


        const challenge =

        await challengeService.createChallenge({

            ...req.body,

            createdBy:req.user.id

        });



        res.status(201).json({

            success:true,

            challenge

        });



    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};








// JOIN

const joinChallenge = async(req,res)=>{


    try{


        const participation =

        await challengeService.joinChallenge(

            req.user.id,

            req.params.id

        );



        res.json({

            success:true,

            message:"Participation enregistrée",

            participation

        });



    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }


};









// COMPLETE

const completeChallenge = async(req,res)=>{


    try{


        const participation =

        await challengeService.completeChallenge(

            req.user.id,

            req.params.id

        );



        res.json({

            success:true,

            message:"Challenge terminé XP ajouté",

            participation

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


    getChallenges,

    createChallenge,

    joinChallenge,

    completeChallenge

};