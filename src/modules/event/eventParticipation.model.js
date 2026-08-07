import mongoose from "mongoose";


const eventParticipationSchema = new mongoose.Schema(
{

    user:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },


    event:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Event",

        required:true

    },


    status:{

        type:String,

        enum:[
            "joined",
            "cancelled"
        ],

        default:"joined"

    }


},
{

    timestamps:true

});



export default mongoose.model(
    "EventParticipation",
    eventParticipationSchema
);