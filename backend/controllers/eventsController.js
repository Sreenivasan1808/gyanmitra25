const eventModel = require("../models/events");
const RegistrationKitModel = require('../models/registrationKit'); // Import the RegistrationKit model
const UserModel = require('../models/user');

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
const deleteWinnerByEventId = async (req, res) => {
    try {
      const { event_id } = req.params; // Assuming event_id is provided as a route parameter
  
      // Find and delete the document with the given event_id
      const deletedWinner = await winners.findOneAndDelete({ event_id });
  
      if (!deletedWinner) {
        return res.status(404).json({ message: `No winner found with event_id: ${event_id}` });
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
  const getCollegeParticipants = async (req, res) => {
    try {
        console.log("Fetching participant count per college...");

        // Step 1: Get all registered users' IDs
        const registeredUsers = await RegistrationKitModel.find({}, { user_id: 1 }).lean();
        const userIds = registeredUsers.map(user => user.user_id);

        // Step 2: Get college names for these users
        const users = await UserModel.find({ user_id: { $in: userIds } }, { user_id: 1, cname: 1 }).lean();

        // Step 3: Count participants per college
        const collegeCounts = users.reduce((acc, user) => {
            acc[user.cname] = (acc[user.cname] || 0) + 1;
            return acc;
        }, {});

        // Step 4: Convert to JSON array
        const result = Object.keys(collegeCounts).map(college => ({
            collegeName: college,
            participantCount: collegeCounts[college]
        }));

        console.log("Result:", result);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};






module.exports={
    getAllEventsByDepartment:getAllEventsByDepartment,
    getEventDetailsById:getEventDetailsById,
    getcount:getCollegeParticipants
}