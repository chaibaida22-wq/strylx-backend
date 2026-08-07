import mongoose from "mongoose";


const eventSchema = new mongoose.Schema(
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

        required:true

    },


    address:{

        type:String,

        default:""

    },


    date:{

        type:Date,

        required:true

    },


    startTime:{

        type:String,

        default:""

    },


    endTime:{

        type:String,

        default:""

    },


    maxParticipants:{

        type:Number,

        default:50

    },


    participantsCount:{

        type:Number,

        default:0

    },


    status:{

        type:String,

        enum:[
            "active",
            "finished",
            "cancelled"
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
    "Event",
    eventSchema
);