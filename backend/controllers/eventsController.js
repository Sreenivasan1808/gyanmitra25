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
module.exports={
    getAllEventsByDepartment:getAllEventsByDepartment,
    getEventDetailsById:getEventDetailsById,
}