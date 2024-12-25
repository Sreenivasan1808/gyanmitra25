const userModel = require("../models/user");
const attendenceModel = require("../models/attendence");

const getDetails = async (req, res) => {
  try {
    console.log("entered");
    const user_id = req.query.gmId;
    console.log(user_id)
    const data = await userModel.findOne({ user_id: user_id });
    if (data) {
      console.log("sent");
      res.status(200).json(data);
    } else {
      console.log("not found")
      res.status(204).json({message: "No such User Found"});
    }
  } catch (e) {
    console.log(e);
  }
};
const getAllParticipants = async (req,res) =>{
  try{
    
    const event_id= req.query.event_id;
    const data = await attendenceModel.find({event_id:event_id});
    const data1 =[]
    console.log(data.length)
    for (let i=0;i<data.length;i++){
      const s=await userModel.findOne({user_id:data[i].user_id})
      console.log(s)
      data1.push(s)
    }
    res.status(200).json(data1)
  }
  catch (e){
    console.log(e)
  }
}
const markAttendence = async (req, res) => {
  try {
    console.log("entered")
    console.log(req.body)
    const user_id = req.body.gmId;
    const event_id = req.body.eventId;
    const status = req.body.status;
    const verification = await attendenceModel.findOne({user_id:user_id,event_id:event_id})
    if(verification==null){
    const newdata = new attendenceModel({
      user_id: user_id,
      event_id: event_id,
      status: status
    });
    const s = await newdata.save();
  
  
    console.log("hi")
    if (s) {
      console.log(s);
      res.status(200).json({message: "marked successfully"});
    } else {
      res.status(201).json({message: "not marked"});
    }
  }
    else{
      res.status(204).json({message: "attendence already marked"})
    }
  } catch (e) {
    console.log(e);
  }
};


module.exports = {
  getDetails: getDetails,
  markAttendence: markAttendence,
  getAllParticipants:getAllParticipants
};

