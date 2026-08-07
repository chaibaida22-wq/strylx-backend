import bcrypt from "bcrypt";

import User from "../user/user.model.js";

import Profile from "../profile/profile.model.js";

import Progress from "../progress/progress.model.js";





const register = async(data)=>{


    const existingUser =
    await User.findOne({

        email:data.email

    });




    if(existingUser){

        throw new Error(
            "Cet email existe déjà."
        );

    }






    const hashedPassword =
    await bcrypt.hash(

        data.password,

        10

    );







    // ===============================
    // Génération automatique username
    // ===============================


    let username =

    `${data.firstname}.${data.lastname}`

    .toLowerCase()

    .replace(/\s+/g,"");





    // Vérifier si username existe déjà

    const existingUsername =

    await User.findOne({

        username

    });





    if(existingUsername){


        username +=

        Date.now();



    }










    // ===============================
    // Création User
    // ===============================


    const user =

    await User.create({

        firstname:data.firstname,

        lastname:data.lastname,

        username,

        email:data.email,

        password:hashedPassword

    });









    // ===============================
    // Création Profile automatique
    // ===============================


    await Profile.create({

        user:user._id,

        firstname:user.firstname,

        lastname:user.lastname,

        avatar:"",

        bio:"",

        ville:"",

        disciplines:[]

    });









    // ===============================
    // Création Progress automatique
    // ===============================


    await Progress.create({

        user:user._id,

        level:1,

        XP:0,

        totalChallenges:0,

        completedChallenges:0,

        badges:[]

    });







    return user;


};





export default {


    register

};