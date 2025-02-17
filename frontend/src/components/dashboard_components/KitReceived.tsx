import { useState } from "react";
import { getParticipantDetailsFromGMID } from "../../services/ParticipantSVC";
import Snackbar from "../util_components/Snackbar";
import useAuth from "../../services/useAuth";
import { updateKitStatus } from "../../services/RegistrationSVC";
import { CheckIcon } from "@heroicons/react/24/solid";
import Modal from "../util_components/Modal";

const KitReceived = () => {
  const [gmid, setGmid] = useState("");
  const [participant, setParticipant] = useState<any>(null);
  const { role } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleKitUpdation = async (e: any) => {
    e.preventDefault();
    const status = await updateKitStatus(gmid, !participant.kitReceived);
    showSnackbar(status?.message, status?.type);
    const details = await getParticipantDetailsFromGMID(gmid);
    console.log(details);

    if (!details) {
      showSnackbar("Invalid GMID", "error");
      return;
    }
    setParticipant(details);
    setModalOpen(false)
  };

  return (
    <div className="py-2 px-8 flex flex-col justify-center items-center gap-4">
      <h2 className="text-xl text-center">Kit Received Information for Website Registered Participantss</h2>
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
                  key: "cname",
                },
                { label: "Year and Department", key: "ccity" },
                { label: "Email", key: "email" },
                { label: "Phone", key: "phone" },
                { label: "Payment status for Events", key: "eventPayed" },
              ].map(({ label, key }) => (
                <tr
                  key={key}
                  className="table-row border-2 border-gray-300 text-center"
                >
                  <td className="font-semibold">{label}</td>
                  <td>{participant[key]}</td>
                </tr>
              ))}
                <tr
                  className="table-row border-2 border-gray-300 text-center"
                >
                  <td className="font-semibold">Has received kit</td>
                  <td>{participant.kitReceived ? "Received" : "Not Received"}</td>
                </tr>
            </tbody>
          </table>
          <div className="flex gap-2">
            {(role === "super-admin" ||
              role === "registration-coordinator") && (
              <button
                className={`mt-4 rounded-lg px-4 py-2 text-white  hover:scale-95 flex items-center gap-2 ${participant.kitReceived ? "bg-red-600 hover:bg-red-700" : "bg-primary-600 hover:bg-primary-700"}`}
                onClick={() => setModalOpen(true)}
              >
                {participant.kitReceived ? "Changed to not received" : "Change to received" }
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

<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="text-center w-56">
          <CheckIcon className="size-32 mx-auto text-green-500" />
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black text-gray-800">Confirm Action</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to change the receival status?
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-green-600 rounded-lg w-full text-white" onClick={handleKitUpdation}>Confirm</button>
            <button
              className="px-4 py-2 bg-accent-100 rounded-lg w-full"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default KitReceived;
