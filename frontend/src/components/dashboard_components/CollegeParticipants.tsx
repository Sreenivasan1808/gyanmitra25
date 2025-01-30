import { useEffect, useState } from "react";
import {
  getAllCollegeList,
  getAllParticipantsCollegeWise,
} from "../../services/ParticipantSVC";
import UserTable from "../util_components/UserTable";
import { downloadParticipantsCollegeWisePdf } from "../../services/DownloadsSVC";
import Snackbar from "../util_components/Snackbar";

const CollegeParticipants = () => {
  const [collegeList, setCollegeList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [participantsList, setParticipantsList] = useState();
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    type: "info", // Default type
  });

  const showSnackbar = (message: string, type: string) => {
    setSnackbar({ isOpen: true, message, type });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  };

  const getCollegeList = async () => {
    const college = await getAllCollegeList();
    setCollegeList(college);
  };

  useEffect(() => {
    getCollegeList();
  }, []);

  const handleGetCollegeWiseParticipants = async (e: any) => {
    e.preventDefault();
    const participants = await getAllParticipantsCollegeWise(inputValue);
    if (participants.message) {
      showSnackbar(participants.message, participants.type);
      return;
    }
    console.log(participants);
    setParticipantsList(participants);
  };

  return (
    <div className="p-4 md:p-8 relative h-full">
      <h1 className="p-8 text-2xl">Participants List</h1>
      <form
        action=""
        className="p-4 border-2 border-accent-400 rounded-lg flex flex-col items-center gap-4 justify-center"
      >
        <div className="flex flex-col gap-2 items-center">
          <label htmlFor="college" className="text-text-900 text-lg">
            College name
          </label>
          <div className="relative w-full md:w-72">
            <select
              id="college"
              name="college"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="p-2 rounded-lg bg-white w-72 border-2 border-accent-100"
            >
              <option value="" disabled>Select a college</option>
              {collegeList.map((college, idx) => (
                <option key={idx} value={college}>{college}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={handleGetCollegeWiseParticipants} className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg">Get Details</button>
      </form>
      {participantsList && (
        <>
          <h1 className="text-xl mt-4 px-8 py-2">
            Participants from <span className="font-semibold text-text-900">{inputValue}</span>
          </h1>
          <div className="w-full flex justify-end">
            <button
              onClick={() => {
                downloadParticipantsCollegeWisePdf(inputValue);
              }}
              className="px-4 py-2 bg-secondary-400 hover:bg-secondary-500 transition-all duration-100 rounded-lg"
            >
              Download as PDF
            </button>
          </div>
          <UserTable users={participantsList} />
        </>
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

export default CollegeParticipants;