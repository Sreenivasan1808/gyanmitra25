import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

export const retrieveRegistrationFormResponses = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/participant/getregistrationdetails`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
}

export const rejectRegistrationRequests = async (emails: string[]) => {
  try {
    const response = await axios.post(`${SERVER_URL}/participant/deleteregistrationdetails`, {emails: emails});
    return response.data
  } catch (error) {
    console.log(error);
    return {message: "Internal server error", type:"error"}
    
  }
}
export const approveRegistrationRequests = async (emails: string[]) => {
  try {
    3
    const response = await axios.post(`${SERVER_URL}/participant/approve`, {emails: emails});
    return response.data
  } catch (error) {
    console.log(error);
    return {message: "Internal server error", type:"error"}
    
  }
}