const userModel= requier("../models/User")
const attendenceModel =require("../models/attendence")

const getDetails = async (req,res) => {
    try{
        const user_id=req.query.gmid
        const data=await userModel.find({userModel:user_id})
        if (data){
            res.status(200).json(data)
        }
        else{
            res.status(204).json("No such User Found")
        }
    }
    catch (e){
        console.log(e)
    }
}
const markAttendence = async(req,res)=>{
    try{
        const user_id=req.body.gmId
        const event_id=req.body.eventId
        const status=req.body.status
        const newdata = new attendenceModel({
            user_id:user_id,
            event_id:event_id,
            status:status
        })
        const s= await newdata.save()
        if (s){
            res.status(200).json("marked successfully")
        }
        else{
            res.status(201).json("not marked")
        }
    }
    catch(e){
        console.log(e)
    }

}

module.exports={
    getDetails:getDetails,
    markAttendence:markAttendence
}