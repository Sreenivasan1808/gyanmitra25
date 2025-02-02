const userModel = require("../models/user");
const attendenceModel = require("../models/attendence");
const workshopAttendenceModel = require("../models/workshopattendence");
const getDetails = async (req, res) => {
  try {
    console.log("entered");
    const user_id = req.query.gmId;
    console.log(user_id);
    const data = await userModel.findOne({ user_id: user_id });
    if (data) {
      console.log("sent");
      res.status(200).json(data);
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
      if(dataVerify.eventPayed!="Paid"){
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
      if(dataVerify.workshopPayed!="Paid"){
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
};
