import { useState } from "react";
import { getParticipantDetailsFromGMID, updateParticipantDetails } from "../../services/ParticipantSVC";
import Snackbar from "../util_components/Snackbar";
import { PencilIcon } from "@heroicons/react/24/outline";
import useAuth from "../../services/useAuth";

const ParticipantInformation = () => {
  const [gmid, setGmid] = useState("");
  const [participant, setParticipant] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedParticipant, setEditedParticipant] = useState<any>(null);
  const {role} = useAuth();

  const handleGetParticipantDetails = async (e: any) => {
    e.preventDefault();
    if (!gmid) {
      showSnackbar("Enter a valid GMID", "error");
      return;
    }
    const details = await getParticipantDetailsFromGMID(gmid);
    console.log(details);
    
    if (!details) {
      showSnackbar("Invalid GMID", "error");
      return;
    }
    setParticipant(details);
    setEditedParticipant(details);
  };

  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  const showSnackbar = (message: any, type: any) =>
    setSnackbar({ isOpen: true, message, type });

  const closeSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, isOpen: false }));

  const handleEditClick = () => {
    let edit = role == "super-admin" || role == "registration-coordinator"
    setIsEditing(true && edit);
  };

  const handleSaveClick = async () => {
    setParticipant(editedParticipant);
    setIsEditing(false);
    const status = await updateParticipantDetails(editedParticipant);
    showSnackbar(status?.message, status?.type)
  };

  const handleChange = (e: any) => {
    setEditedParticipant({
      ...editedParticipant,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="py-2 px-8 flex flex-col justify-center items-center gap-4">
      <h2 className="text-xl text-center">Participant Information</h2>
      <div className="border-2 border-secondary-500 p-4 rounded-lg m-2 w-72 flex flex-col items-center gap-4">
        <div className="flex flex-col gap-1 max-w-72">
          <label htmlFor="gmid">GMID</label>
          <input
            type="email"
            id="gmid"
            name="gmid"
            className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-2"
            autoFocus
            value={gmid}
            onChange={(e) => setGmid(e.target.value)}
          />
        </div>
        <button
          className="rounded-lg px-4 py-2 text-white text-center bg-green-600 hover:bg-green-700 hover:scale-95"
          onClick={handleGetParticipantDetails}
        >
          Get Details
        </button>
      </div>

      {participant && (
        <div className="border-2 border-secondary-500 p-4 rounded-lg m-2 w-full flex flex-col items-center justify-center">
          <table className="table w-full">
            <tbody>
              <tr className="table-row border-2 border-gray-300 text-center">
                <td className="font-semibold">GMID</td>
                <td>{participant["user_id"]}</td>
              </tr>
              {[
                { label: "Full name", key: "name" },
                { label: "Gender", key: "gender" },
                {
                  label: "College",
                  key: "cname"
                },
                { label: "Year and Department", key: "ccity" },
                { label: "Email", key: "email" },
                { label: "Phone", key: "phone" },
              ].map(({ label, key}) => (
                <tr
                  key={key}
                  className="table-row border-2 border-gray-300 text-center"
                >
                  <td className="font-semibold">{label}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        name={key}
                        value={editedParticipant[key]}
                        onChange={handleChange}
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1"
                      />
                    ) : (
                      participant[key] 
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2">
            {
              (role === "super-admin" || role === "registration-coordinator") &&
              <button
              className="mt-4 rounded-lg px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 hover:scale-95 flex items-center gap-2"
              onClick={isEditing ? handleSaveClick : handleEditClick}
            >
              {!isEditing ? <PencilIcon className="size-4"/> : ""}
              {isEditing ? "Save" : "Edit"}
            </button>
            }
            {isEditing && (
              <button
                className="mt-4 rounded-lg px-4 py-2 text-white bg-accent-600 hover:bg-accent-700 hover:scale-95"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            )}
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

export default ParticipantInformation;
