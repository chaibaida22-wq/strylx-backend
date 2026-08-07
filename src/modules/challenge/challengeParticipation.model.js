import mongoose from "mongoose";


const challengeParticipationSchema = new mongoose.Schema(
{

    user:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },


    challenge:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Challenge",

        required:true

    },


    status:{

        type:String,

        enum:[
            "joined",
            "completed",
            "cancelled"
        ],

        default:"joined"

    },


    completedAt:{

        type:Date

    }


},
{

    timestamps:true

});



export default mongoose.model(
    "ChallengeParticipation",
    challengeParticipationSchema
);