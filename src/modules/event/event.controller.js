import eventService from "./event.service.js";




// GET EVENTS

const getEvents = async(req,res)=>{


    try{


        const events =
        await eventService.getEvents();



        res.json({

            success:true,

            events

        });



    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }


};







// GET ONE EVENT

const getEvent = async(req,res)=>{


    try{


        const event =

        await eventService.getEventById(
            req.params.id
        );



        res.json({

            success:true,

            event

        });


    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }


};







// CREATE EVENT

const createEvent = async(req,res)=>{


    try{


        const event =

        await eventService.createEvent({

            ...req.body,

            createdBy:req.user.id

        });



        res.status(201).json({

            success:true,

            event

        });



    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }


};








// JOIN

const joinEvent = async(req,res)=>{


    try{


        const participation =

        await eventService.joinEvent(

            req.user.id,

            req.params.id

        );



        res.json({

            success:true,

            message:"Participation enregistrée",

            participation

        });



    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }


};







// LEAVE

const leaveEvent = async(req,res)=>{


    try{


        await eventService.leaveEvent(

            req.user.id,

            req.params.id

        );



        res.json({

            success:true,

            message:"Participation annulée"

        });


    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }


};





export default {


    getEvents,

    getEvent,

    createEvent,

    joinEvent,

    leaveEvent

};