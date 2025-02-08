import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

export const downloadAttendanceExcelByEvent = async (eventId: string) => {
  try {
    const response = await axios.get(
      `${SERVER_URL}/participant/eventattendancedownload`,
      { params: { event_id: eventId }, responseType: "blob" }
    );
    if (response.status == 200) {
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      return blob;
    }
  } catch (error) {
    return null;
  }
};

export const downloadAttendanceExcelByWorkshop = async (workshopId: string) => {
  try {
    const response = await axios.get(
      `${SERVER_URL}/participant/workshopattendancedownload`,
      { params: { workshopid: workshopId }, responseType: "blob" }
    );
    if (response.status == 200) {
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      return blob;
    }
  } catch (error) {
    return null;
  }
};

export const downloadParticipantsCollegeWisePdf = async (cname: string) => {
  try {
    const response = await axios.get(
      `${SERVER_URL}/coordinator/participants-pdf`,
      { params: { cname: cname }, responseType: "blob" }
    );
    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", `${cname} Student List.pdf`);
    document.body.appendChild(link);
    link.click();
    return { message: "Downloaded successfully", type: "success" };
  } catch (error) {
    console.error(error);
    return { message: error, type: "error" };
  }
};

export const downloadAllEventWinnersDeptPdf = async (domain_name: string) => {
  try {
    const response = await axios.get(
      `${SERVER_URL}/event/getdomainwisewinners`,
      {
        params: { domain_name: domain_name },
        responseType: "arraybuffer", // Use arraybuffer for binary data
      }
    );

    // Create a Blob from the arraybuffer response data
    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);

    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", `${domain_name}_winners.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up the temporary element and URL object
    document.body.removeChild(link);
    URL.revokeObjectURL(fileURL);

    return { message: "Downloaded successfully", type: "success" };
  } catch (error) {
    console.error(error);
    return { message: error, type: "error" };
  }
};

