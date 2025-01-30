import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

export const downloadAttendanceExcelByEvent = async (eventId: number) => {
  try {
    const response = await axios.get(
      `${SERVER_URL}/participant/attendancedownload`,
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
