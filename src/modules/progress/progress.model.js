import mongoose from "mongoose";


const progressSchema = new mongoose.Schema({


user:{


    type:mongoose.Schema.Types.ObjectId,

    ref:"User",

    unique:true,

    required:true

},





// Points gagnés

xp:{


    type:Number,

    default:0


},





// Niveau utilisateur

level:{


    type:Number,

    default:1


},





// Nombre total défis disponibles

totalChallenges:{


    type:Number,

    default:0


},





// Défis terminés

completedChallenges:{


    type:Number,

    default:0


},





// Pourcentage progression globale

progressPercentage:{


    type:Number,

    default:0


},





// Badges obtenus

badges:[


{

    type:mongoose.Schema.Types.ObjectId,

    ref:"Badge"

}


]



},{

timestamps:true

});





export default mongoose.model(
"Progress",
progressSchema
);