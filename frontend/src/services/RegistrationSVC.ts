import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

export const retrieveRegistrationFormResponses = async () => {
  try {
    const response = await axios.get(
      `${SERVER_URL}/participant/getregistrationdetails`
    );
    console.log(response);

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const rejectRegistrationRequests = async (emails: string[]) => {
  try {
    const response = await axios.post(
      `${SERVER_URL}/participant/deleteregistrationdetails`,
      { emails: emails }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return { message: "Internal server error", type: "error" };
  }
};
export const approveRegistrationRequests = async (
  emails: string[],
  approvedFor: number
) => {
  try {
    3;
    const response = await axios.post(`${SERVER_URL}/participant/approve`, {
      emails: emails,
      approvedFor: approvedFor,
    });
    return { ...response.data, type: "succcess" };
  } catch (error) {
    console.log(error);
    return { message: "Internal server error", type: "error" };
  }
};

export const updatePaymentStatus = async (gmid: string, type: number) => {
  try {
    const response = await axios.put(
      `${SERVER_URL}/coordinator/updatePayment`,
      { user_id: gmid, update: type }
    );
    if (response.status == 200) {
      return { message: response.data.message, type: "success" };
    }
  } catch (error: any) {
    console.error(error);
    return { message: error.response.data.message, type: "error" };
  }
};

export const getDayWisePaymentDetails = async (day: string) => {
  try {
    const response = await axios.get(
      `${SERVER_URL}/coordinator/daywise-payment`,
      { params: { day: day } }
    );
    if (response.status == 200) {
      return {
        message: response.data.message,
        type: "success",
        userDetails: response.data.userDetails,
      };
    }
  } catch (error: any) {
    console.error(error);
    return { message: error.response.data.message, type: "error" };
  }
};
