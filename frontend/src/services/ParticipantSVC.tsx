import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

export const getParticipantDetailsFromGMID = async (gmid: string) => {
  try {
    const response = await axios.get(
      `${SERVER_URL}/participant/getParticipantDetails`,
      { params: { gmId: gmid } }
    );
    console.log(response);
    if (response.status == 200) {
      return response.data;
    } else {
      console.error(response.data);
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const markEventParticipantAttendance = async (
  gmid: string,
  eventId: string
) => {
  try {
    const response = await axios.post(
      `${SERVER_URL}/participant/markAttendance`,
      { gmId: gmid, eventId: eventId, status: true }
    );
    // console.log(response)
    if (response.status == 200) {
      return {message: "Successfully marked as present", type: 'success'};
    }else if(response.status == 204){
      return {message: "Attendance already marked", type: "info"}
    } 
    else {
      return {message: "Attendance not marked", type: 'error'};
    }
  } catch (error) {
    return { message: "Something went wrong with the server", type: "error" };
  }
};

export const getEventParticipantsList = async (eventId: number) => {
  try {
    const response = await axios.get(`${SERVER_URL}/participant/getAllParticipants`, {params: {event_id: eventId}});
    if(response.status == 200){
      return response.data;
    }else{
      return null;
    }
  } catch (error) {
    console.log("Get event participants list")
    console.log(error)
    return null;
  }
}

export const getAllParticipantsCollegeWise = async (college: String) => {
  try {
    const response = await axios.get(`${SERVER_URL}/coordinator/get-collegewise-participants`, {params: {cname:college}});
    console.log(response);
    
    if(response.status == 200){
      return response.data.users;
    }else{
      return {message: "No data available", type: "error"};
    }

  } catch (error) {
    return {message: "Server error", type: "error"}
  }
}

export const getAllCollegeList = async () => {
  try {
    const response = await axios.get(`${SERVER_URL}/coordinator/getcollegelist`);
    if(response.status == 200){
      return response.data.uniqueCnames;
    }else{
      return {message: "Couldn't retreive college list", type: "error"}
    }
  } catch (error) {
    return {message: "Internal server error", type: "error"}
  }
}

export const markWorkshopParticipantAttendance = async (gmid: string, workshopid: string) => {
  try {
    const response = await axios.post(
      `${SERVER_URL}/participant/markWorkshopAttendance`,
      { gmId: gmid, workshopId: workshopid, status: true }
    );
    // console.log(response)
    if (response.status == 200) {
      return {message: "Successfully marked as present", type: 'success'};
    }else if(response.status == 204){
      return {message: "Attendance already marked", type: "info"}
    } 
    else {
      return {message: "Attendance not marked", type: 'error'};
    }
  } catch (error) {
    return { message: "Something went wrong with the server", type: "error" };
  }
}