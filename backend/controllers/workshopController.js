const workshopModel = require("../models/workshop");

const getAllWorkshopByDepartment = async (req, res) => {
    //req will have organizing department name like vipravuha
    try{
        const dep = req.query.department
        const data = await workshopModel.find({organizing_department:dep})
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

const getWorkshopDetailsById = async (req, res) => {
    //req will have workshop id. return the workshop details of that id
    try{
        const workshopId = req.query.workshopId
        const data = await eventModel.find({workshopid:workshopId})
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
    getAllWorkshopByDepartment:getAllWorkshopByDepartment,
    getWorkshopDetailsById:getWorkshopDetailsById
}