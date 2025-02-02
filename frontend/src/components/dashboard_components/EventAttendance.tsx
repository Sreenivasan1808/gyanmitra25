import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  getEventParticipantsList,
  getParticipantDetailsFromGMID,
  markEventParticipantAttendance,
} from "../../services/ParticipantSVC";
import Snackbar from "../util_components/Snackbar";
import { downloadAttendanceExcelByEvent } from "../../services/DownloadsSVC";
import { saveAs } from "file-saver";
import { useNavigate, useParams } from "react-router-dom";
import { getEventDetails } from "../../services/EventsSVC";
const EventAttendance = () => {
  //Event details
  const [event, setEvent] = useState<any>();

  const { "event-id": eventId } = useParams();
  console.log(eventId);

  if (!eventId) {
    return (
      <div className="h-full w-full flex justify-center items-center text-2xl text-text-950">
        Not a valid workshop id
      </div>
    );
  }

  //Details of the new participant
  const [participantDetails, setParticipantDetails] = useState({
    gmid: "",
    name: "",
    college: "",
  });

  //Error message to show if GMID entered is not valid
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //Snackbar handler state
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    type: "info", // Default type
  });

  const [participantsList, setParticipantsList] = useState<[] | null>(null);

  const showSnackbar = (message: string, type: string) => {
    setSnackbar({ isOpen: true, message, type });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  };

  //Get the details of a participant using GMID - for attendance
  const handleGetParticipantDetails = async (e: any) => {
    e.preventDefault();
    if (participantDetails.gmid.length == 0) {
      setError("Enter the GMID");
      return;
    }
    // console.log(participantDetails.gmid)
    let details = await getParticipantDetailsFromGMID(participantDetails.gmid);
    // console.log(details);
    if (details != null) {
      setParticipantDetails((prevData) => ({
        ...prevData,
        name: details.name,
        college: details.cname,
      }));
      setError("");
    } else {
      setParticipantDetails({
        gmid: "",
        name: "",
        college: "",
      });
      setError("Invalid GMID");
    }
  };

  //Mark a new participant as present
  const handleMarkAsPresent = async (e: any) => {
    e.preventDefault();
    if (participantDetails.gmid.length == 0) {
      setError("Enter the GMID");
      return;
    }
    console.log(event);
    if (error.length == 0 && event) {
      let result = await markEventParticipantAttendance(
        participantDetails.gmid,
        event.eventid + ""
      );
      //display message
      // console.log(result);
      showSnackbar(result.message, result.type);
    }
    handleEventParticipantsListTable();
  };

  //Download excel file containing participants list of this event
  const handleAttendanceExcelDownload = async (e: any) => {
    e.preventDefault();
    if (event) {
      const excel_blob = await downloadAttendanceExcelByEvent(event?.eventid);
      if (excel_blob != null) {
        saveAs(excel_blob, `${event.name} Participants List.xlsx`);
        showSnackbar("Downloading...", "info");
      } else {
        showSnackbar(
          "Something went wrong. Couldn't download the file",
          "error"
        );
      }
    }
  };

  //Fetch participants list for the attendance table
  const handleEventParticipantsListTable = async () => {
    if (eventId) {
      const participants = await getEventParticipantsList(eventId);
      if (participants == null || participants.length == 0) {
        return;
      }
      console.log("Event participants list");
      console.log(participants);

      setParticipantsList(participants);
    }
  };

  const handleGetEventDetails = async () => {
    const eventDetails = await getEventDetails(eventId);
    setEvent(eventDetails);
  };

  //Use effect for handleEventParticipantsListTable
  useEffect(() => {
    handleGetEventDetails();
    handleEventParticipantsListTable();
  }, []);

  useEffect(() => {
    if (error.length == 0) return;
    showSnackbar(error, "error");
    setError("");
  }, [error]);

  return (
    <div className="w-full h-full overflow-scroll">
      {event != null && (
        <div className="p-8">
          {/* Back Button */}
          <button
            className="flex gap-2 border-2 rounded-lg border-accent-300 p-2 hover:scale-95"
            onClick={() => {
              setParticipantDetails({
                gmid: "",
                name: "",
                college: "",
              });
              setError("");
              setParticipantsList(null);
              navigate(-1);
            }}
          >
            <span>
              <ArrowLeftIcon className="size-6" />
            </span>
            Back
          </button>
          <h1 className="text-xl text-text-950 text-center">
            Event name:{" "}
            <span className="text-text-950 font-semibold">{event.name}</span>
          </h1>
          {/* Instructions  */}
          <div className="p-4 m-4 border-2 border-accent-400 rounded-lg">
            <h2 className="text-lg font-semibold">Instructions</h2>
            <ul className="list-disc text-md px-4">
              <li>
                Make sure you are entering{" "}
                <span className="font-semibold">
                  attendance for the right event
                </span>
              </li>
              <li>Enter the GMID of the participant in the given text box</li>
              <li>
                The name and college of the participant will be displayed in the
                corresponding text boxes if the GMID is valid{" "}
              </li>
              <li>Press the <span className="font-semibold"> 'Mark as Present'</span> button to mark attendance for the participant</li>
              <li>Once attendance is marked for a participant their details are displayed in the table below</li>
              <li>You can download the list of participants using the <span className="font-semibold">Download</span> button</li>
            </ul>
          </div>

          {/* Form and table container */}
          <div className="p-4 flex flex-col gap-2">
            {/* Attendance form */}
            <form className="flex flex-col  border-2 rounded-lg border-accent-300 p-4">
              <div className="md:flex gap-4 p-4 justify-between">
                <div className="flex flex-col gap-1 max-w-72">
                  <label htmlFor="gmid">GMID</label>
                  <input
                    type="text"
                    id="gmid"
                    name="gmid"
                    className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-2"
                    autoFocus
                    onChange={(e) =>
                      setParticipantDetails((prevData) => ({
                        ...prevData,
                        gmid: e.target.value,
                      }))
                    }
                    onBlur={handleGetParticipantDetails}
                    value={participantDetails.gmid}
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="gmid">Full Name</label>
                  <input
                    type="text"
                    id="fname"
                    name="fname"
                    disabled
                    className="hover:cursor-not-allowed border-2 rounded-lg outline-none p-2"
                    value={participantDetails.name}
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="gmid">College</label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    disabled
                    className="hover:cursor-not-allowed border-2 rounded-lg outline-none p-2"
                    value={participantDetails.college}
                  />
                </div>
              </div>

              {/* <button
                  className="rounded-lg px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white hover:scale-95"
                  onClick={handleGetParticipantDetails}
                >
                  Get Details
                </button> */}
              {/* <p className="text-center text-red-600 p-4  ">{error}</p> */}
              <div className="w-full flex justify-center">
                <button
                  className={`${
                    error.length != 0 || participantDetails.college.length == 0
                      ? "hover:cursor-not-allowed bg-green-400"
                      : "hover:cursor-pointer bg-green-600 hover:bg-green-700 hover:scale-95"
                  } rounded-lg px-4 py-2  text-white text-center`}
                  disabled={
                    error.length != 0 && participantDetails.college.length == 0
                  }
                  onClick={handleMarkAsPresent}
                >
                  Mark as present
                </button>
              </div>
            </form>

            {/* Table displaying list of participants marked as present */}
            <div className="flex justify-between mt-4 items-center">
              <h1 className="text-lg mt-4">List of present participants</h1>
              <button
                className="rounded-lg px-4 py-2 bg-primary-600 hover:bg-primary-700 hover:scale-95 text-white"
                onClick={handleAttendanceExcelDownload}
              >
                Download
              </button>
            </div>
            <table className="w-full text-base rtl:text-right m-2 text-center overflow-x-scroll">
              <thead className=" text-text-900 uppercase bg-secondary-500">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    S.No
                  </th>
                  <th scope="col" className="px-6 py-3 w-fit">
                    GMID
                  </th>
                  <th scope="col" className="px-6 py-3 w-full">
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-3 w-full">
                    College
                  </th>
                </tr>
              </thead>
              <tbody>
                {participantsList != null &&
                  participantsList.map((participant: any, idx) => {
                    return (
                      <tr className="bg-white border-b" key={idx}>
                        <td className="px-4 py-4 w-fit">{idx + 1}</td>
                        <td
                          scope="row"
                          className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                        >
                          {participant.user_id}
                        </td>
                        <td
                          scope="row"
                          className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                        >
                          {participant.name}
                        </td>
                        <td
                          scope="row"
                          className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                        >
                          {participant.cname}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Snackbar
        message={snackbar.message}
        isOpen={snackbar.isOpen}
        type={snackbar.type}
        onClose={closeSnackbar}
      />
    </div>
  );
};

export default EventAttendance;
