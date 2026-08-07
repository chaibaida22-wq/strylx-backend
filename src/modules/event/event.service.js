import Event from "./event.model.js";

import EventParticipation from "./eventParticipation.model.js";




// GET ALL EVENTS

const getEvents = async()=>{


    return await Event.find({

        status:"active"

    })
    .populate(
        "createdBy",
        "username"
    );


};






// GET EVENT BY ID

const getEventById = async(id)=>{


    return await Event.findById(id);


};







// CREATE EVENT

const createEvent = async(data)=>{


    return await Event.create(data);


};








// JOIN EVENT

const joinEvent = async(
    userId,
    eventId
)=>{


    const event =

    await Event.findById(eventId);



    if(!event){

        throw new Error(
            "Evénement introuvable"
        );

    }




    if(
        event.participantsCount >= 
        event.maxParticipants
    ){

        throw new Error(
            "Nombre maximum atteint"
        );

    }




    const alreadyJoined =

    await EventParticipation.findOne({

        user:userId,

        event:eventId

    });



    if(alreadyJoined){

        throw new Error(
            "Vous participez déjà"
        );

    }




    const participation =

    await EventParticipation.create({

        user:userId,

        event:eventId

    });




    event.participantsCount += 1;


    await event.save();



    return participation;


};







// LEAVE EVENT

const leaveEvent = async(
    userId,
    eventId
)=>{


    const participation =

    await EventParticipation.findOneAndDelete({

        user:userId,

        event:eventId

    });



    if(participation){


        await Event.findByIdAndUpdate(

            eventId,

            {
                $inc:{
                    participantsCount:-1
                }
            }

        );


    }



    return participation;


};






export default {


    getEvents,

    getEventById,

    createEvent,

    joinEvent,

    leaveEvent

};