import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

export const getEventDetails = async (eventId: String) => {
  try {
    const response = await axios.get(
      `${SERVER_URL}/event/geteventdetailsbyid`,
      { params: { eventId: eventId } }
    );
    if (response.status == 200) {
      return response.data;
    } else if (response.status == 204) {
      return { message: "Invalid event id", type: "error" };
    }
  } catch (error) {
    console.log(error);
    return { message: "Server error", type: "error" };
  }
};

export const getWorkshopDetails = async (workshopId: String) => {
  try {
    const response = await axios.get(
      `${SERVER_URL}/workshop/getworkshopdetailsbyid`,
      { params: { workshopId: workshopId } }
    );
    if (response.status == 200) {
      return response.data;
    } else if (response.status == 204) {
      return { message: "Invalid workshop id", type: "error" };
    }
  } catch (error) {
    console.log(error);
    return { message: "Server error", type: "error" };
  }
};

export const getAllWorkshopListByDept = async (dept: string) => {
  try {
    const response = await axios.get(
      `${SERVER_URL}/workshop/getallworkshopbydepartment`,
      { params: { department: dept } }
    );
    if (response.status == 200) {
      return response.data;
    } else if (response.status == 204) {
      return { message: "Invalid workshop id", type: "error" };
    }
  } catch (error) {
    console.log(error);
    return { message: "Server error", type: "error" };
  }
};

export const getAllEventListByDept = async (dept: string) => {
  try {
    const response = await axios.get(
      `${SERVER_URL}/event/getalleventbydepartment`,
      { params: { department: dept } }
    );
    if (response.status == 200) {
      return response.data;
    } else if (response.status == 204) {
      return { message: "Invalid event id", type: "error" };
    }
  } catch (error) {
    console.log(error);
    return { message: "Server error", type: "error" };
  }
};
