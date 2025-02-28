const winnersModel = require("../models/winners");
const attendanceModel = require("../models/attendence");
const userModel = require("../models/user");
const eventModel = require("../models/events");
const workshopAttendanceModel = require("../models/workshopattendence");
const workshopModel = require("../models/workshop");
const PaymentDetailsModel=require("../models/payment_details");
const UserModel = require("../models/user");
const updatePayment = async (req, res) => {
  console.log("enterd")
  try {
    const { user_id, update } = req.body;

    // Validate inputs
    if (!user_id || update === undefined) {
      return res.status(400).send({ error: "user_id and update are required" });
    }

    // Find participant by user_id
    const participant = await userModel.findOne({ user_id: user_id });
    if (!participant) {
      return res.status(404).send({ error: "Participant not found" });
    }
    var amount=0
    var day="other day"
    const currdate=new Date()
      const day1=new Date("2025-02-19")
      const day2=new Date("2025-02-20")
      if(currdate==day1){
        day="Day 1"
      }
      else if(currdate==day2)
      {
        day="Day 2"
      }
    // Update payment status based on the 'update' value
    if (update === 1) {
      participant.eventPayed = "Payed";
      const verifyPaydetail = await PaymentDetailsModel.findOne({user_id:user_id,date:day})
      if (verifyPaydetail==null){
        const newPayDetail=new PaymentDetailsModel({
          user_id:user_id,
          amount:250,
          date:day
        })
        const s=await newPayDetail.save()
      }
      else{
        verifyPaydetail.amount+=250
        const s=await verifyPaydetail.save()
      }
    } else if (update === 2) {
      participant.workshopPayed = "Payed";
      const verifyPaydetail = await PaymentDetailsModel.findOne({user_id:user_id,date:day})
      if (verifyPaydetail==null){
        const newPayDetail=new PaymentDetailsModel({
          user_id:user_id,
          amount:400,
          date:day
        })
        const s=await newPayDetail.save()
      }
      else{
        verifyPaydetail.amount+=400
        const s=await verifyPaydetail.save()
      }
    } else if (update === 3) {
      participant.workshopPayed = "Payed";
      participant.eventPayed = "Payed";
      const verifyPaydetail = await PaymentDetailsModel.findOne({user_id:user_id,date:day})
      if (verifyPaydetail==null){
        const newPayDetail=new PaymentDetailsModel({
          user_id:user_id,
          amount:650,
          date:day
        })
        const s=await newPayDetail.save()
      }
      else{
        verifyPaydetail.amount+=650
        const s=await verifyPaydetail.save()
      }
    } else {
      return res.status(400).send({ error: "Invalid update value" });
    }

    // Save the updated participant
    const updatedParticipant = await participant.save();

    // Return success response
    res.status(200).send({
      message: "Participant payment details updated successfully",
      participant: updatedParticipant,
    });
  } catch (error) {
    console.error("Error updating participant:", error.message);
    res.status(500).send({ error: "Error updating participant" });
  }
};
const deleteAttendance = async (req, res) => {
  try {
    const { user_id, event_id } = req.body;

    // Validate that user_id and event_id are provided
    if (!user_id || !event_id) {
      return res.status(400).json({ message: "user_id and event_id are required" });
    }

    // Attempt to delete the attendance record
    const deletedData = await attendanceModel.deleteOne({ user_id: user_id, event_id: event_id });

    // Check if the record was found and deleted
    if (deletedData.deletedCount === 0) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Send a success response
    res.status(200).json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error deleting attendance record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteWorkshopAttendance = async (req, res) => {
  try {
    const { user_id, workshop_id } = req.body;
    

    // Validate that user_id and event_id are provided
    if (!user_id || !workshop_id) {
      return res.status(400).json({ message: "user_id and workshop_id are required" });
    }

    // Attempt to delete the attendance record
    const deletedData = await workshopAttendanceModel.deleteOne({ user_id: user_id, workshopid: workshop_id });

    // Check if the record was found and deleted
    if (deletedData.deletedCount === 0) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Send a success response
    res.status(200).json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error deleting attendance record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const editWinners = async (req, res) => {
  try {
    const { eventId, firstPrize, secondPrize, thirdPrize,firstPrizeTeamName,secondPrizeTeamName,thirdPrizeTeamName } = req.body;
    let fname = firstPrizeTeamName;
    let sname = secondPrizeTeamName;
    let tname = thirdPrizeTeamName;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }
    const existingWinners = await winnersModel.findOne({ event_id: eventId });

    if (!existingWinners) {
      return res.status(404).json({ message: "Winners data not found for this event" });
    }
    if (firstPrize && Array.isArray(firstPrize)) {
      for (let i = 0; i < firstPrize.length; i++) {
        if (firstPrize[i] && firstPrize[i].length !== 0) {
          const verify = await attendanceModel.findOne({
            user_id: firstPrize[i],
            event_id: eventId,
          });
          if (!verify) {
            return res.status(204).json({ message: `${firstPrize[i]} did not participate in this event` });
          }
        }
      }
      existingWinners.first_prize = firstPrize;
    }
    if (secondPrize && Array.isArray(secondPrize)) {
      for (let i = 0; i < secondPrize.length; i++) {
        if (secondPrize[i] && secondPrize[i].length !== 0) {
          const verify = await attendanceModel.findOne({
            user_id: secondPrize[i],
            event_id: eventId,
          });
          if (!verify) {
            return res.status(204).json({ message: `${secondPrize[i]} did not participate in this event` });
          }
        }
      }
      existingWinners.second_prize = secondPrize;
    }
    if (thirdPrize && Array.isArray(thirdPrize)) {
      for (let i = 0; i < thirdPrize.length; i++) {
        if (thirdPrize[i] && thirdPrize[i].length !== 0) {
          const verify = await attendanceModel.findOne({
            user_id: thirdPrize[i],
            event_id: eventId,
          });
          if (!verify) {
            return res.status(204).json({ message: `${thirdPrize[i]} did not participate in this event` });
          }
        }
      }
      existingWinners.third_prize = thirdPrize;
    }
    existingWinners.fname=fname
    existingWinners.sname=sname
    existingWinners.tname=tname
    const updatedWinners = await existingWinners.save();

    if (updatedWinners) {
      return res.status(200).json({ message: "Winners updated successfully" });
    } else {
      return res.status(500).json({ message: "Failed to update winners" });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "An error occurred", error: e.message });
  }
};
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
      fname:req.body.firstPrizeTeamName,
      sname:req.body.secondPrizeTeamName,
      tname:req.body.thirdPrizeTeamName,
      approved:false
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
      mobileNo:participant.phone,
      ccity:participant.ccity
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
      mobileNo:participant.phone,
      ccity:participant.ccity
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
      mobileNo:participant.phone,
      ccity:participant.ccity
    });
  }

  return {
    firstPrize: firstPrizeDetails,
    secondPrize: secondPrizeDetails,
    thirdPrize: thirdPrizeDetails,
    fname: winners.fname,
    sname: winners.sname,
    tname: winners.tname
  };
};

const getWinners = async (req, res) => {
  try {
    const data = await winnersModel.findOne({ event_id: req.query.eventId });
    if (data == null) {
      res.status(204).json({ message: "no details found" });
    } else {
      const winnersDetails = await getWinnersDetailsFromGmid(data);
      winnersDetails.approved = data.approved;
      console.log(winnersDetails);
      res.status(200).json(winnersDetails);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "An error occurred", e });
  }
};
const triggerCollegeWiseParticipant=async (req,res)=>{
  const data=await participantsCollegeWise(req.query.cname)
  if (data==null) {
    res.status(201).json({ message: "No users found for the given college name" })
  }else{
    res.status(200).json(data)
  }
}
const participantsCollegeWise = async (cname) => {
  //to test
  try {
    // const { cname } = req.query;
    // console.log(cname);

    // Find users with the given college name
    const users = await userModel.find({ cname });

    if (users.length === 0) {
      // return res
      //   .status(404)
      //   .json({ message: "No users found for the given college name" });
      return null
    }

    // Create an array of user IDs
    const userIds = users.map((user) => user.user_id);

    // Find attendance records for these user IDs
    const attendanceRecords = await attendanceModel.find({
      user_id: { $in: userIds },
    });
    const workshopAttendanceRecords = await workshopAttendanceModel.find({
      user_id: { $in: userIds },
    });

    console.log("attendance record:")
    console.log(attendanceRecords)

    // Create an array of event IDs from the attendance records
    const eventIds = attendanceRecords.map((record) => record.event_id);
    const workshopIds = workshopAttendanceRecords.map((record) => record.workshopid);
    console.log("Event ids");
    console.log(eventIds)

    // Find event details for these event IDs
    const events = await eventModel.find({ eventid: { $in: eventIds } });
    const workshops = await workshopModel.find({ workshopid: { $in: workshopIds } });
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
      const workshopAttendance = workshopAttendanceRecords.filter(
        (record) => record.user_id === user.user_id
      );
      console.log("User attendance")
      console.log(userAttendance);
      const participatedWorkshops = workshopAttendance.map((record) => {
        const workshopDetails = workshops.find(
          (event) => event.workshopid === record.workshopid
        );
        console.log("Workshop details")
        console.log(workshopDetails)
        return workshopDetails;
      });
    
      return {
        user: {
          user_id: user.user_id,
          name: user.name,
          phone: user.phone,
          ccity: user.ccity
        },
        events: participatedEvents,
        workshops: participatedWorkshops
      };
    });
    console.log("User event details")
    console.log(userEventDetails);
    console.log(userEventDetails[0].events);
    return userEventDetails
    // res.status(200).json({ users: userEventDetails });
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
const getUniqueDepartmentsWorkshop = async (req, res) => {
  try {
    const uniqueDepts = await workshopModel.distinct("organizing_department");
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

const getDayWisePaymentDetails = async (req, res) => {
  try {
    const {day} = req.query;

    if(!day){
      res.status(400).json({
        message: "Day parameter required",
      })
    }
    const payment_details = await PaymentDetailsModel.find({date: day});

    let userDetails = [];
    for(let payment of payment_details){
      let user_id = payment.user_id;

      const userData = await UserModel.findOne({user_id: user_id}).exec();
      console.log(userData);
      if(!userData){
        res.status(400).json({
          message: `User data not found for GMID: ${user_id}`
        })
      }
      console.log("payment");
      console.log(payment);
      let amount = payment.amount;
      userDetails.push({
        user_id: user_id,
        name: userData.name,
        college: userData.cname,
        email: userData.email,
        amount: amount,
      })
    }
    console.log("user details: ");
    console.log(userDetails);
    res.status(200).json({message: "Success", userDetails: userDetails});
  } catch (error) {
    res.status(500).json({
      message:"Internal server error",
      error: error
    })
  } 
}
const approveEventWinner = async (req, res) => {
  try {
    const { event_id } = req.body;

    // Find the event by event_id
    const event = await winnersModel.findOne({ event_id: event_id });

    // Check if the event exists
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Approve the event
    event.approved = true;

    // Save the updated event
    await event.save();

    // Send a success response
    res.status(200).json({ message: 'Event approved successfully', event });
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getDomainWiseWinnersData = async (req, res) => {
  try {
      const { domain_name } = req.query;

      if (!domain_name) {
          return res.status(400).send("Domain name (domain_name) is required");
      }

      const events = await eventModel.find({ organizing_department: domain_name });
      if (!events.length) return res.status(404).send("No events found for the given domain");

      const eventIds = events.map(event => event.eventid);
      const winners = await winnersModel.find({ event_id: { $in: eventIds } });
      if (!winners.length) return res.status(404).send("No winners found for the events in the given domain");

      const responseData = [];

      for (const event of events) {
          const eventWinners = winners.filter(w => w.event_id === event.eventid);
          if (!eventWinners.length) continue;

          const eventData = {
              eventName: event.name,
              organizingDepartment: event.organizing_department,
              winners: []
          };

          for (const winner of eventWinners) {
              const firstPrizeWinners = await Promise.all(
                  winner.first_prize.map(userId => userModel.findOne({ user_id: userId }))
              );
              const secondPrizeWinners = await Promise.all(
                  winner.second_prize.map(userId => userModel.findOne({ user_id: userId }))
              );
              const thirdPrizeWinners = await Promise.all(
                  winner.third_prize.map(userId => userModel.findOne({ user_id: userId }))
              );

              const winnersData = [
                  { prize: "First Prize", users: firstPrizeWinners, team: winner.fname },
                  { prize: "Second Prize", users: secondPrizeWinners, team: winner.sname },
                  { prize: "Third Prize", users: thirdPrizeWinners, team: winner.tname },
              ];

              for (const winnerData of winnersData) {
                  const winnerNames = winnerData.users.map(u => u?.name || "N/A").join(", ");
                  const collegeNames = winnerData.users.map(u => u?.cname || "N/A").join(", ");

                  const winnerInfo = {
                      prize: winnerData.prize,
                      winnerNames: winnerNames,
                      collegeNames: collegeNames,
                  };

                  if (event.eventtype !== "Individual") {
                      winnerInfo.teamName = winnerData.team;
                  }

                  eventData.winners.push(winnerInfo);
              }
          }

          responseData.push(eventData);
      }

      res.status(200).json({
          success: true,
          domain: domain_name,
          data: responseData,
      });
  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Internal Server Error");
  }
};
const deleteWinnerByEventId = async (req, res) => {
  try {
    const { event_id } = req.body; // Assuming event_id is provided as a route parameter

    // Find and delete the document with the given event_id
    const deletedWinner = await winnersModel.findOneAndDelete({ event_id:event_id });

    if (!deletedWinner) {
      return res.status(204).json({ message: `No winner found with event_id: ${event_id}` });
    }

    res.status(200).json({
      message: "Winner deleted successfully",
      data: deletedWinner,
    });
  } catch (error) {
    console.error("Deletion Error:", error);
    res.status(500).json({ message: "Error deleting winner", error: error.message });
  }
};
module.exports = {
  editWinners:editWinners,
  deleteWinnerByEventId:deleteWinnerByEventId,
  uploadWinners: uploadWinners,
  getWinners: getWinners,
  getParticipantsCollegeWise: triggerCollegeWiseParticipant,
  getCollegeList: getCollegeList,
  getUniqueDepartments:getUniqueDepartments,
  collegeWiseParticipant:participantsCollegeWise,
  getUniqueDepartmentsWorkshop:getUniqueDepartmentsWorkshop,
  updatePayment:updatePayment,
  deleteAttendance:deleteAttendance,
  deleteWorkshopAttendance:deleteWorkshopAttendance,
  getDayWisePaymentDetails:getDayWisePaymentDetails,
  approveEventWinner:approveEventWinner,
  getDomainWiseWinnersData:getDomainWiseWinnersData
};
