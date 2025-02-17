import { useState } from "react";
import { getParticipantDetailsFromGMID } from "../../services/ParticipantSVC";
import Snackbar from "../util_components/Snackbar";
import { updatePaymentStatus } from "../../services/RegistrationSVC";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../util_components/Modal";

const PaymentUpdate = () => {
  const [gmid, setGmid] = useState("");
  const [participant, setParticipant] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventOrWorkshop, setEventOrWorkshop] = useState(0);

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

  const handlePaymentUpdate = async (type: any) => {
    const status = await updatePaymentStatus(participant.user_id, type);
    showSnackbar(status?.message, status?.type);
    const details = await getParticipantDetailsFromGMID(gmid);
    console.log(details);

    if (!details) {
      showSnackbar("Invalid GMID", "error");
      return;
    }
    setParticipant(details);
    setModalOpen(false);
  };

  return (
    <div className="px-8 py-2 flex flex-col justify-center items-center">
      {/* Instructions  */}
      <div className="border-2 border-accent-400 rounded-lg p-4 md:m-4">
        <h2 className="font-semibold text-lg">Instructions</h2>
        <ul className="list-disc px-4">
          <li>You can change the payment status of a participant here</li>
          <li>
            Payment status can be changed only for those participants who have
            been approved, <span className="font-semibold">i.e. a GMID must have been generated for the
            participant</span>
          </li>
          <li>Enter the GMID of the participant in the given field</li>
          <li><span className="font-semibold">Receive payment from the participant</span> for Events or Workshop.</li>
          <li>Update the corresponding payment status below using the <span className="font-semibold">Update as Paid</span> button</li>
        </ul>
      </div>

      {/* Get GMID  */}
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

      {/* Participant info and payment updation */}
      {participant && (
        <div className="w-full">
          <table className="w-full text-base rtl:text-right m-2 text-center overflow-x-scroll">
            <thead className="text-text-900 uppercase bg-secondary-500 w-full">
              <tr className="w-full">
                <th scope="col" className="px-6 py-3">
                  GMID
                </th>
                <th scope="col" className="px-6 py-3 w-full">
                  Full Name
                </th>
                <th scope="col" className="px-6 py-3 w-full">
                  Event payment status
                </th>
                {/* <th scope="col" className="px-6 py-3 w-full">
                  Workshop payment status
                </th> */}
              </tr>
            </thead>
            <tbody className="w-full">
              <tr className="bg-white border-b w-full">
                <td
                  scope="col"
                  className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                >
                  {participant.user_id}
                </td>
                <td
                  scope="col"
                  className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                >
                  {participant.name}
                </td>
                <td
                  scope="col"
                  className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-full text-center flex gap-2 justify-center items-center"
                >
                  {participant.eventPayed == "Payed" ? "Paid" : "Not Paid"}
                  {participant.eventPayed.toLowerCase() !== "paid" && participant.eventPayed.toLowerCase() !== "payed" ? (
                    <button
                      className="px-4 py-2 rounded-lg text-white bg-primary-400 hover:scale-95"
                      onClick={(_e: any) => {
                        setEventOrWorkshop(1)
                        setModalOpen(true)}}
                    >
                      Update as paid
                    </button>
                  ) : (
                    ""
                  )}
                </td>
                {/* <td
                  scope="col"
                  className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-full text-center "
                >
                  {participant.workshopPayed == "Payed" ? "Paid" : "Not Paid"}
                  {participant.workshopPayed.toLowerCase() !== "paid" && participant.eventPayed.toLowerCase() !== "payed"? (
                    <button
                      className="px-4 py-2 rounded-lg text-white bg-primary-400 hover:scale-95 ml-2"
                      onClick={(_e: any) => {
                        setEventOrWorkshop(2)
                        setModalOpen(true)}}
                    >
                      Update as paid
                    </button>
                  ) : (
                    ""
                  )}
                </td> */}
              </tr>
            </tbody>
          </table>
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
          <InformationCircleIcon className="size-32 mx-auto text-red-500" />
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black text-text-800">Confirm Payment Update</h3>
            <p className="text text-text-600">
              Have you received an amount of <span className="text-text-800 font-semibold">Rs. {eventOrWorkshop == 1 ? "250" : "400"}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-primary-600 rounded-lg w-full text-white"
              onClick={() => handlePaymentUpdate(eventOrWorkshop)}
            >
              Confirm
            </button>
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

export default PaymentUpdate;
