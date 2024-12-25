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
