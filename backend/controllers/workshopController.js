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
        console.log(workshopId);
        const data = await workshopModel.findOne({workshopid:workshopId})
        console.log(data);
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
        res.status(500).json({message: "Server error"})
    }
}
module.exports={
    getAllWorkshopByDepartment:getAllWorkshopByDepartment,
    getWorkshopDetailsById:getWorkshopDetailsById
}