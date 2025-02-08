import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "../util_components/Snackbar";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  deleteWorkshopAttendance,
  getParticipantDetailsFromGMID,
  getWorkshopParticipantsList,
  markWorkshopParticipantAttendance,
} from "../../services/ParticipantSVC";
import { getWorkshopDetails } from "../../services/EventsSVC";
import { TrashIcon } from "@heroicons/react/24/outline";
import saveAs from "file-saver";
import { downloadAttendanceExcelByWorkshop } from "../../services/DownloadsSVC";

const WorkshopAttendance = () => {
  //   const [workshop, setWorkshop] = useState();
  const { "workshop-id": workshopId } = useParams();
  console.log(workshopId);

  if (!workshopId) {
    return (
      <div className="h-full w-full flex justify-center items-center text-2xl text-text-950">
        Not a valid workshop id
      </div>
    );
  }
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    type: "info", // Default type
  });
  const [error, setError] = useState("");
  const [participantsList, setParticipantsList] = useState<[] | null>(null);
  const [participantDetails, setParticipantDetails] = useState({
    gmid: "",
    name: "",
    college: "",
  });

  const navigate = useNavigate();

  const showSnackbar = (message: string, type: string) => {
    setSnackbar({ isOpen: true, message, type });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  };

  const [workshop, setWorkshop] = useState<any>();

  const handleGetWorkshopDetails = async () => {
    const details = await getWorkshopDetails(workshopId);

    // console.log(details);
    // console.log(workshopId);

    setWorkshop(details);
    handleWorkshopParticipantsListTable();
  };

  useEffect(() => {
    handleGetWorkshopDetails();
    
  }, []);

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

  const handleDeleteAttendance = async (user_id: string) => {
    const status = await deleteWorkshopAttendance(user_id, workshopId);
    showSnackbar(status.message, status.type);
    handleWorkshopParticipantsListTable();
  };

  const handleMarkAsPresent = async (e: any) => {
    e.preventDefault();
    if (participantDetails.gmid.length == 0) {
      setError("Enter the GMID");
      return;
    }
    if (error.length == 0) {
      let result = await markWorkshopParticipantAttendance(
        participantDetails.gmid,
        workshopId
      );
      //display message
      // console.log(result);
      showSnackbar(result.message, result.type);
    }
    handleWorkshopParticipantsListTable();
  };

  const handleAttendanceExcelDownload = async (e: any) => {
    e.preventDefault();
    if (workshop) {
      const excel_blob = await downloadAttendanceExcelByWorkshop(workshopId);
      if (excel_blob != null) {
        saveAs(excel_blob, `${workshop.name} Participants List.xlsx`);
        showSnackbar("Downloading...", "info");
      } else {
        showSnackbar(
          "Something went wrong. Couldn't download the file",
          "error"
        );
      }
    }
  }

  const handleWorkshopParticipantsListTable = async () => {
    console.log("workshop");
    
    console.log(workshop);
    if (workshopId) {
      console.log("inside");
      const participants = await getWorkshopParticipantsList(workshopId);
      if (participants == null || participants.length == 0) {
        return;
      }
      console.log("Participants");

      console.log(participants);
      setParticipantsList(participants);
    }
  };

  // useEffect(() => {
  // }, [workshopId])

  return (
    <div className="w-full h-full overflow-scroll pb-4">
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
        {/* Form and table container */}
        <div className="p-4 flex flex-col gap-2">
          <h1 className="text-lg text-text-950 ">
            Workshop name:
            <span className="text-text-950 font-semibold">
              {" " + workshop?.name}
            </span>
          </h1>

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
                <label htmlFor="gmid">
                  Full Name (automatically retrieved)
                </label>
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
                <label htmlFor="gmid">College (automatically retrieved)</label>
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
            <p className="text-center text-red-600 p-4  ">{error}</p>
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
                <th scope="col" className="px-6 py-3 w-full">
                  Mobile No.
                </th>
                <th scope="col" className="px-6 py-3 w-full">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {participantsList != null && participantsList.length > 0 ? (
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
                      <td
                        scope="row"
                        className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                      >
                        {participant.phone}
                      </td>
                      <td
                        scope="row"
                        className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                      >
                        <TrashIcon
                          className="size-6 text-red-500 hover:cursor-pointer hover:scale-95"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteAttendance(participant.user_id);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Snackbar
        message={snackbar.message}
        isOpen={snackbar.isOpen}
        type={snackbar.type}
        onClose={closeSnackbar}
      />
    </div>
  );
};

export default WorkshopAttendance;
