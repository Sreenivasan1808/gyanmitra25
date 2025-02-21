const userModel = require("../models/user");
const attendenceModel = require("../models/attendence");
const workshopAttendenceModel = require("../models/workshopattendence");
const registrationKitModel=require("../models/registrationKit")
const updateParticipantData = async (req, res) => {
  try {
    const { user_id, email, name, gender, phone, collegeName, collegeCity } = req.body;

    
    if (!user_id) {
      return res.status(400).send({ error: "User Id is required" });
    }

  
    const participant = await userModel.findOne({user_id:user_id });
    if (!participant) {
      return res.status(404).send({ error: "Participant not found" });
    }

    // Update participant data with the provided fields
    if (name) participant.name = name;
    if (gender) participant.gender = gender;
    if (phone) participant.phone = phone;
    if (collegeName) participant.cname = collegeName;
    if (collegeCity) participant.ccity = collegeCity;
    if (email)participant.email=email

    // Save the updated participant record
    const updatedParticipant = await participant.save();

    // Return success response
    res.status(200).send({
      message: "Participant details updated successfully",
      participant: updatedParticipant,
    });
  } catch (error) {
    console.error("Error updating participant:", error.message);
    res.status(500).send({ error: "Error updating participant" });
  }
};
const registrationKit = async (req, res) => {
  try {
    const { user_id, kitReceived } = req.body;
    console.log("hi",kitReceived)
    // Check if a registration kit document for the given user_id already exists
    const verify = await registrationKitModel.findOne({ user_id });
    let kit;

    if (verify) {
      // Update the existing document with the new kitRecieved value
      verify.kitReceived = kitReceived;
      kit = await verify.save();
    } else {
      // Create a new registration kit document
      kit = new registrationKitModel({ user_id:user_id, kitReceived:kitReceived });
      await kit.save();
    }

    res.status(201).json({
      message: verify ? `Registration kit status updated to ${kitReceived ? "Received" :"Not Received"} ` : "Registration kit received successfully",
    });
  } catch (error) {
    console.error("Insert/Update Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getDetails = async (req, res) => {
  try {
    console.log("entered");
    const user_id = req.query.gmId;
    const email = req.query.email;
    let data;
    console.log(user_id);
    if(user_id){
      data = await userModel.findOne({ user_id: user_id });
      
    }else if(email.length > 0){
      data = await userModel.findOne({ email: email });
    }else{
      res.status(500).json({message: "GMID or E-Mail is required"});
    }
    if (data) {
      console.log("sent");
      const data1=await registrationKitModel.findOne({user_id:data.user_id})
      if(data1){
        res.status(200).json({...data.toObject(),"kitReceived":data1.kitReceived });
      }
      else{
        res.status(200).json({...data.toObject(),"kitReceived":false });
      }
      
    } else {
      console.log("not found");
      res.status(204).json({ message: "No such User Found" });
    }
  } catch (e) {
    console.log(e);
  }
};
const getAllParticipants = async (req, res) => {
  try {
    const event_id = req.query.event_id;
    const data = await attendenceModel.find({ event_id: event_id });
    const data1 = [];
    console.log(data.length);
    for (let i = 0; i < data.length; i++) {
      const s = await userModel.findOne({ user_id: data[i].user_id });
      console.log(s);
      data1.push(s);
    }
    res.status(200).json(data1);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
    console.log(e);
  }
};

const getAllWorkshopParticipants = async (req, res) => {
  try {
    const workshopId = req.query.workshopId;
    console.log("workshopid");
    console.log(workshopId);
    const data = await workshopAttendenceModel.find({ workshopid: workshopId });
    const data1 = [];
    console.log(data.length);
    for (let i = 0; i < data.length; i++) {
      const s = await userModel.findOne({ user_id: data[i].user_id });
      console.log(s);
      data1.push(s);
    }
    res.status(200).json(data1);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
    console.log(e);
  }
};

const markAttendence = async (req, res) => {
  try {
    console.log("entered hi");
    console.log(req.body);
    const user_id = req.body.gmId;
    const event_id = req.body.eventId;
    const status = req.body.status;
    const verification = await attendenceModel.findOne({
      user_id: user_id,
      event_id: event_id,
    });
    const dataVerify= await userModel.findOne({user_id:user_id})
    console.log(dataVerify)
    if (verification == null && dataVerify!=null ) {
      if(dataVerify.eventPayed!="Payed"){
        console.log("error")
        res.status(400).json({message:"participant not paid for event"})
        return
      }
      const newdata = new attendenceModel({
        user_id: user_id,
        event_id: event_id,
        status: status,
      });
      const s = await newdata.save();

      console.log("hi");
      if (s) {
        console.log(s);
        res.status(200).json({ message: "marked successfully" });
      } else {
        res.status(201).json({ message: "not marked" });
      }
    } else {
      res.status(204).json({ message: "attendence already marked" });
    }
  } catch (e) {
    console.log(e);
  }
};

const getAttendanceDetails = async (req, res) => {
  try {
    console.log("entered");
    const participants = await attendenceModel.find({
      event_id: req.query.event_id,
    });
    let jsonData = [];

    for (let i = 0; i < participants.length; i++) {
      const user_id = participants[i].user_id;
      const data = await userModel.findOne({ user_id: user_id });

      if (data) {
        jsonData.push({
          user_id: data.user_id,
          name: data.name,
          cname: data.cname,
        });
      }
    }
    res.status(200).json(jsonData);
  } catch (e) {
    console.log(e);
  }
};

const markWorkshopAttendance = async (req, res) => {
  //mark attendance for workshop
  //use this route "/participant/markWorkshopAttendance"
  try {
    console.log("entered");
    console.log(req.body);
    const user_id = req.body.gmId;
    const workshopid = req.body.workshopId;
    const status = req.body.status;
    const verification = await workshopAttendenceModel.findOne({
      user_id: user_id,
      workshopid: workshopid,
    });
    const dataVerify= await userModel.findOne({user_id:user_id,})
    if (verification == null && dataVerify!=null) {
      if(dataVerify.workshopPayed!="Payed"){
        res.status(400).json({message:"participant not paid for workshop"})
        return
      }
      const newdata = new workshopAttendenceModel({
        user_id: user_id,
        workshopid: workshopid,
        status: status,
      });
      const s = await newdata.save();

      console.log("hi");
      if (s) {
        console.log(s);
        res.status(200).json({ message: "marked successfully" });
      } else {
        res.status(201).json({ message: "not marked" });
      }
    } else {
      res.status(204).json({ message: "attendence already marked" });
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getDetails: getDetails,
  markAttendence: markAttendence,
  getAllParticipants: getAllParticipants,
  getAttendanceDetails: getAttendanceDetails,
  markWorkshopAttendance: markWorkshopAttendance,
  getAllWorkshopParticipants:getAllWorkshopParticipants,
  updateParticipantData:updateParticipantData,
  registrationKit:registrationKit
};
