const winnersModel = require("../models/winners");
const attendanceModel = require("../models/attendence");
const userModel = require("../models/user");
const eventModel = require("../models/events");
const workshopModel=require("../models/workshop")

const uploadWinners = async (req, res) => {
  try {
    console.log("body");
    console.log(req.body);
    const first_prize = [];
    const second_prize = [];
    const third_prize = [];
    const event_id = req.body.eventId;
    const fp = req.body.firstPrize;
    console.log(event_id);
    console.log(fp);

    for (let i = 0; i < fp.length; i++) {
      if (fp[i] != null && fp[i].length != 0) {
        const verify = await attendanceModel.findOne({
          user_id: fp[i],
          event_id: event_id,
        });
        if (verify == null) {
          return res
            .status(204)
            .json({ message: `${fp[i]} not participated in this event` });
        }
        first_prize.push(fp[i]);
      }
    }

    const sp = req.body.secondPrize;
    for (let i = 0; i < sp.length; i++) {
      if (sp[i] != null && sp[i].length != 0) {
        const verify = await attendanceModel.findOne({
          user_id: sp[i],
          event_id: event_id,
        });
        if (verify == null) {
          return res
            .status(204)
            .json({ message: `${sp[i]} not participated in this event` });
        }
        second_prize.push(sp[i]); // Corrected this line
      }
    }

    const tp = req.body.thirdPrize;
    for (let i = 0; i < tp.length; i++) {
      // Corrected this line
      if (tp[i] != null && tp[i].length != 0) {
        const verify = await attendanceModel.findOne({
          user_id: tp[i],
          event_id: event_id,
        });
        if (verify == null) {
          return res
            .status(204)
            .json({ message: `${tp[i]} not participated in this event` });
        }
        third_prize.push(tp[i]);
      }
    }

    const newData = new winnersModel({
      first_prize: first_prize,
      second_prize: second_prize,
      third_prize: third_prize,
      event_id: event_id,
    });

    const s = await newData.save(); // Ensure to await the save operation
    console.log("Saved winners");
    if (s) {
      res.status(200).json({ message: "uploaded successfully" });
    } else {
      res.status(201).json({ message: "upload unsuccessful" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "An error occurred", e });
  }
};

const getWinnersDetailsFromGmid = async (winners) => {
  console.log("winners list");
  console.log(winners);
  let firstPrizeIds = winners.first_prize;
  let secondPrizeIds = winners.second_prize;
  let thirdPrizeIds = winners.third_prize;

  let firstPrizeDetails = [];
  for (let i = 0; i < firstPrizeIds.length; i++) {
    let participant = await userModel.findOne({ user_id: firstPrizeIds[i] });
    console.log("firstprize " + i);
    console.log(participant);
    firstPrizeDetails.push({
      gmid: participant.user_id,
      name: participant.name,
      college: participant.cname,
    });
  }
  let secondPrizeDetails = [];
  for (let i = 0; i < secondPrizeIds.length; i++) {
    let participant = await userModel.findOne({ user_id: secondPrizeIds[i] });
    console.log("secondprize " + i);
    console.log(participant);
    secondPrizeDetails.push({
      gmid: participant.user_id,
      name: participant.name,
      college: participant.cname,
    });
  }
  let thirdPrizeDetails = [];
  for (let i = 0; i < thirdPrizeIds.length; i++) {
    let participant = await userModel.findOne({ user_id: thirdPrizeIds[i] });
    console.log("thirdprize " + i);
    console.log(participant);
    thirdPrizeDetails.push({
      gmid: participant.user_id,
      name: participant.name,
      college: participant.cname,
    });
  }

  return {
    firstPrize: firstPrizeDetails,
    secondPrize: secondPrizeDetails,
    thirdPrize: thirdPrizeDetails,
  };
};

const getWinners = async (req, res) => {
  try {
    const data = await winnersModel.findOne({ event_id: req.query.eventId });
    if (data == null) {
      res.status(204).json({ message: "no details found" });
    } else {
      const winnersDetails = await getWinnersDetailsFromGmid(data);
      console.log(winnersDetails);
      res.status(200).json(winnersDetails);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "An error occurred", e });
  }
};

const getParticipantsCollegeWise = async (req, res) => {
  //to test
  try {
    const { cname } = req.query;
    console.log(cname);

    // Find users with the given college name
    const users = await userModel.find({ cname });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found for the given college name" });
    }

    // Create an array of user IDs
    const userIds = users.map((user) => user.user_id);

    // Find attendance records for these user IDs
    const attendanceRecords = await attendanceModel.find({
      user_id: { $in: userIds },
    });

    console.log("attendance record:")
    console.log(attendanceRecords)

    // Create an array of event IDs from the attendance records
    const eventIds = attendanceRecords.map((record) => record.event_id);
    console.log("Event ids");
    console.log(eventIds)

    // Find event details for these event IDs
    const events = await eventModel.find({ eventid: { $in: eventIds } });
    console.log("events")
    console.log(events)

    // Map users to their event participation details
    const userEventDetails = users.map((user) => {
      const userAttendance = attendanceRecords.filter(
        (record) => record.user_id === user.user_id
      );
      console.log("User attendance")
      console.log(userAttendance);
      const participatedEvents = userAttendance.map((record) => {
        const eventDetails = events.find(
          (event) => event.eventid === record.event_id
        );
        console.log("Event details")
        console.log(eventDetails)
        return eventDetails;
      });
    
      return {
        user: {
          user_id: user.user_id,
          name: user.name,
        },
        events: participatedEvents,
      };
    });
    console.log("User event details")
    console.log(userEventDetails);
    console.log(userEventDetails[0].events);
    res.status(200).json({ users: userEventDetails });
  } catch (error) {
    console.error("Error fetching users and events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCollegeList = async (req, res) => {
  try {
    const uniqueCnames = await userModel.distinct("cname");

    res.status(200).json({
      uniqueCnames
    });
  } catch (error) {
    console.error("Error fetching unique cnames:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getUniqueDepartments = async (req, res) => {
  try {
    const uniqueDepts = await eventModel.distinct("organizing_department");
    res.status(200).json({
      uniqueDepts
  });
} catch (error) {
    console.error("Error fetching departments: ", error);
    res.status(500).json({
      message: "Server Error",
    });
    
  }
  
}

module.exports = {
  uploadWinners: uploadWinners,
  getWinners: getWinners,
  getParticipantsCollegeWise: getParticipantsCollegeWise,
  getCollegeList: getCollegeList,
  getUniqueDepartments:getUniqueDepartments,
};
