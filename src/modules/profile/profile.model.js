import mongoose from "mongoose";


const profileSchema = new mongoose.Schema({


    user:{


        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true,

        unique:true

    },



    firstname:{


        type:String,

        required:true

    },



    lastname:{


        type:String,

        required:true

    },



    dateNaissance:{


        type:Date,

        default:null

    },



    avatar:{


        type:String,

        default:""

    },



    bio:{


        type:String,

        default:""

    },



    ville:{


        type:String,

        default:""

    },



    disciplinePrincipale:{


        type:String,

        default:""

    },



    sousDisciplines:[{


        type:String


    }]



},


{


timestamps:true


});





export default mongoose.model(
    "Profile",
    profileSchema
);