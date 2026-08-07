import mongoose from "mongoose";


const userSchema = new mongoose.Schema(

{

    firstname:{
        type:String,
        required:true,
        trim:true
    },


    lastname:{
        type:String,
        required:true,
        trim:true
    },


    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },


    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },


    password:{
        type:String,
        required:true
    },


    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },


    avatar:{
        type:String,
        default:""
    },


    isVerified:{
        type:Boolean,
        default:false
    }


},

{

    timestamps:true

}

);


export default mongoose.model(
    "User",
    userSchema
);