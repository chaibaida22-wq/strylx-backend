import mongoose from "mongoose";


const challengeSchema = new mongoose.Schema(
{

    title:{
        type:String,
        required:true
    },


    description:{
        type:String,
        required:true
    },


    image:{
        type:String,
        default:""
    },


    discipline:{
        type:String,
        required:true
    },


    ville:{
        type:String,
        default:""
    },


    difficulty:{
        type:String,

        enum:[
            "facile",
            "moyen",
            "difficile"
        ],

        default:"facile"
    },


    xpReward:{
        type:Number,

        default:50
    },


    startDate:{
        type:Date,

        default:Date.now
    },


    endDate:{
        type:Date
    },


    status:{
        type:String,

        enum:[
            "active",
            "finished",
            "disabled"
        ],

        default:"active"
    },


    createdBy:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    }


},
{

    timestamps:true

});



export default mongoose.model(
    "Challenge",
    challengeSchema
);