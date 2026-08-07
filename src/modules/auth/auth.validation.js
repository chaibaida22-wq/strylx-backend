const validateRegister = (req, res, next) => {


    const {

        firstname,

        lastname,

        email,

        password,

        confirmPassword


    } = req.body;





    if(

        !firstname ||

        !lastname ||

        !email ||

        !password ||

        !confirmPassword


    ){


        return res.status(400).json({

            success:false,

            message:"Tous les champs sont obligatoires."

        });


    }








    const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;





    if(!emailRegex.test(email)){


        return res.status(400).json({

            success:false,

            message:"Adresse email invalide."

        });


    }









    if(password.length < 6){


        return res.status(400).json({

            success:false,

            message:"Mot de passe minimum 6 caractères."

        });


    }









    if(password !== confirmPassword){


        return res.status(400).json({

            success:false,

            message:"Les mots de passe ne correspondent pas."

        });


    }






    next();


};








const validateLogin = (req,res,next)=>{


    const {

        email,

        password


    } = req.body;





    if(!email || !password){


        return res.status(400).json({

            success:false,

            message:"Email et mot de passe obligatoires."

        });


    }





    next();


};






export {

    validateRegister,

    validateLogin

};