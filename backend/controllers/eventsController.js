const eventModel = require("../models/events");

const getAllEventsByDepartment = async (req, res) => {
    //req will have organizing department name like vipravuha
    try{
        console.log(req.query)
        const dep = req.query.department
        const data = await eventModel.find({organizing_department:dep})
        if(data==null){
            res.status(204).json({message:"no data found"})
        }
        else{
            res.status(200).json(data)
        }
    }
    catch(e)
    {
        console.log(e)
    }

}

const getEventDetailsById = async (req, res) => {
    //req will have event id. return the event details of that id
    try{
        const eventId = req.query.eventId
        const data = await eventModel.findOne({eventid:eventId})
        if(data==null){
            res.status(204).json({message:"no data found"})
        }
        else{
            res.status(200).json(data)
        }
    }
    catch(e)
    {
        console.log(e)
    }
}
module.exports={
    getAllEventsByDepartment:getAllEventsByDepartment,
    getEventDetailsById:getEventDetailsById
}