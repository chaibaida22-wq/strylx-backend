import mongoose from "mongoose";


const badgeSchema = new mongoose.Schema(
{

    name:{

        type:String,

        required:true,

        unique:true,

        trim:true

    },


    description:{

        type:String,

        default:""

    },


    icon:{

        type:String,

        default:""

    },


    requiredXP:{

        type:Number,

        default:0

    }


},
{
    timestamps:true
}
);



export default mongoose.model(
    "Badge",
    badgeSchema
);