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

export const markParticipantAttendance = async (
  gmid: string,
  eventId: number
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
    return {message: "Something went wrong with the server", type: 'error'};
  }
};
