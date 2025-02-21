import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

export const uploadWinners = async (winnersList: any, eventId: number) => {
  try {
    const response = await axios.post(
      `${SERVER_URL}/coordinator/uploadwinners`,
      { ...winnersList, eventId: eventId }
    );
    if (response.status == 200) {
      return { message: "Uploaded successfully", type: "success" };
    } else if (response.status == 201) {
      return { message: "Upload failed", type: "error" };
    } else if (response.status == 204) {
      return {
        message:
          "One of the participants is not from this event. Recheck GMIDs",
        type: "error",
      };
    } else {
      return { message: "Server error", type: "error" };
    }
  } catch (error) {
    console.log(error);
    return { message: "Server error", type: "error" };
  }
};
export const editWinners = async (winnersList: any, eventId: number) => {
  try {
    const response = await axios.patch(
      `${SERVER_URL}/coordinator/editwinners`,
      { ...winnersList, eventId: eventId }
    );
    if (response.status == 200) {
      return { message: "Uploaded successfully", type: "success" };
    } else if (response.status == 201) {
      return { message: "Upload failed", type: "error" };
    } else if (response.status == 204) {
      return {
        message:
          "One of the participants is not from this event. Recheck GMIDs",
        type: "error",
      };
    } else {
      return { message: "Server error", type: "error" };
    }
  } catch (error) {
    console.log(error);
    return { message: "Server error", type: "error" };
  }
};

export const getWinnersList = async (eventId: String) => {
  try {
    const response = await axios.get(`${SERVER_URL}/coordinator/getwinners`, {
      params: { eventId: eventId },
    });
    if (response.status == 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteWinners = async (eventId: string) => {
  try {
    const response = await axios.delete(`${SERVER_URL}/coordinator/deleteWinner`, { 
      data: { event_id: eventId } 
    });
    if(response.status === 200){
      return { message: "Deleted successfully", type: "success" };
    }
    else{
      return { message: "No such event", type: "warning" };
    }
  } catch (error) {
    console.error(error);
    return { message: "Internal Server error", type: "error" };
  }
}
