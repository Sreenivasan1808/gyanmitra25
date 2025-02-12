import { useEffect, useState } from "react";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import { getParticipantDetailsFromGMID } from "../../services/ParticipantSVC";
import Snackbar from "../util_components/Snackbar";
import {
  editWinners,
  getWinnersList,
  uploadWinners,
} from "../../services/WinnersSVC";
import { useNavigate, useParams } from "react-router-dom";
import { approveEventWinners, getEventDetails } from "../../services/EventsSVC";
import useAuth from "../../services/useAuth";
import Modal from "../util_components/Modal";

const EventWinners = () => {
  const { "event-id": eventId } = useParams();
  console.log(eventId);
  if (!eventId) {
    return (
      <div className="h-full w-full flex justify-center items-center text-2xl text-text-950">
        Not a valid event id
      </div>
    );
  }

  const [event, setEvent] = useState<any>();
  const [modalOpen, setModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    type: "info", // Default type
  });
  const [formData, setFormData] = useState<any>({
    firstPrize: [
      {
        gmid: "",
        college: "",
        name: "",
      },
    ],
    secondPrize: [
      {
        gmid: "",
        college: "",
        name: "",
      },
    ],
    thirdPrize: [
      {
        gmid: "",
        college: "",
        name: "",
      },
    ],
    firstPrizeTeamName: "",
    secondPrizeTeamName: "",
    thirdPrizeTeamName: "",
    approved: false,
  });
  const [isUpdate, setIsUpdate] = useState<boolean>(false); //boolean variable to check if it uploading or editing winners

  const navigate = useNavigate();
  const { role } = useAuth();

  //Upload the winners list for this event
  const handleWinnersUpload = async (e: any) => {
    e.preventDefault();

    if (!event) return;

    // Check if all fields have values
    if (
      !formData.firstPrize.length ||
      !formData.secondPrize.length ||
      !formData.thirdPrize.length ||
      (event.eventtype === "Group" &&
        (!formData.firstPrizeTeamName.trim() ||
          !formData.secondPrizeTeamName.trim() ||
          !formData.thirdPrizeTeamName.trim()))
    ) {
      showSnackbar("Please fill all required fields.", "error");
      return;
    }

    let winnersIds = {
      firstPrize: formData.firstPrize.map((item: any) => item.gmid),
      secondPrize: formData.secondPrize.map((item: any) => item.gmid),
      thirdPrize: formData.thirdPrize.map((item: any) => item.gmid),
      firstPrizeTeamName: formData.firstPrizeTeamName,
      secondPrizeTeamName: formData.secondPrizeTeamName,
      thirdPrizeTeamName: formData.thirdPrizeTeamName,
    };

    if (event.eventtype === "Individual") {
      winnersIds.firstPrizeTeamName = " ";
      winnersIds.secondPrizeTeamName = " ";
      winnersIds.thirdPrizeTeamName = " ";
    }

    let status;
    if (isUpdate) {
      status = await editWinners(winnersIds, event?.eventid);
    } else {
      status = await uploadWinners(winnersIds, event?.eventid);
    }

    const fetchData = async () => {
      try {
        // Fetch event details
        const eventDetails = await getEventDetails(eventId);
        setEvent(eventDetails);

        // Fetch winners after event details are set
        const eventWinners = await getWinnersList(eventId);
        console.log(eventWinners);

        if (eventWinners) {
          setFormData((prev: any) => ({
            ...prev,
            firstPrize: eventWinners.firstPrize || prev.firstPrize,
            secondPrize: eventWinners.secondPrize || prev.secondPrize,
            thirdPrize: eventWinners.thirdPrize || prev.thirdPrize,
            firstPrizeTeamName: eventWinners.fname || prev.firstPrizeTeamName,
            secondPrizeTeamName: eventWinners.sname || prev.secondPrizeTeamName,
            thirdPrizeTeamName: eventWinners.tname || prev.thirdPrizeTeamName,
            approved: eventWinners.approved || false,
          }));
          let editable = false;
          if (role == "domain-coordinator" || role == "super-admin") {
            editable = true;
          }
          setEditable(editable);
          setIsUpdate(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showSnackbar("Error fetching data", "error");
      }
    };

    fetchData();
    setModalOpen(false);
    showSnackbar(status?.message, status?.type);
  };

  const [editable, setEditable] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event details
        const eventDetails = await getEventDetails(eventId);
        setEvent(eventDetails);

        // Fetch winners after event details are set
        const eventWinners = await getWinnersList(eventId);
        console.log("Event winners");
        
        console.log(eventWinners);

        if (eventWinners) {
          setFormData((prev: any) => ({
            ...prev,
            firstPrize: eventWinners.firstPrize || prev.firstPrize,
            secondPrize: eventWinners.secondPrize || prev.secondPrize,
            thirdPrize: eventWinners.thirdPrize || prev.thirdPrize,
            firstPrizeTeamName: eventWinners.fname || prev.firstPrizeTeamName,
            secondPrizeTeamName: eventWinners.sname || prev.secondPrizeTeamName,
            thirdPrizeTeamName: eventWinners.tname || prev.thirdPrizeTeamName,
            approved: eventWinners.approved || false,
          }));
          let editable = false;
          if (role == "domain-coordinator" || role == "super-admin") {
            editable = true;
          }
          setEditable(editable);
          setIsUpdate(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showSnackbar("Error fetching data", "error");
      }
    };

    fetchData();
  }, [eventId]);

  const showSnackbar = (message: string, type: string) => {
    setSnackbar({ isOpen: true, message, type });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  };

  //Clear all forms
  const handleClearButton = (e: any) => {
    e.preventDefault();
    setFormData({
      firstPrize: [
        {
          gmid: "",
          college: "",
          name: "",
        },
      ],
      secondPrize: [
        {
          gmid: "",
          college: "",
          name: "",
        },
      ],
      thirdPrize: [
        {
          gmid: "",
          college: "",
          name: "",
        },
      ],
      firstPrizeTeamName: "",
      secondPrizeTeamName: "",
      thirdPrizeTeamName: "",
    });
  };

  const handleGmidChange = (prizeCategory: any, index: any, event: any) => {
    const newGmid = event.target.value;

    // Update the state immutably

    setFormData((prevFormData: any) => {
      const updatedPrizes = [...prevFormData[prizeCategory]];
      updatedPrizes[index] = {
        ...updatedPrizes[index],

        gmid: newGmid,
      };

      return {
        ...prevFormData,
        [prizeCategory]: updatedPrizes,
      };
    });
  };

  const handleGetParticipantDetails = async (
    prizeCategory: string,
    index: number
  ) => {
    const gmid = formData[prizeCategory][index].gmid;
    if (gmid == null || gmid.length == 0) {
      return;
    }
    let participantDetails = await getParticipantDetailsFromGMID(gmid);



    if (participantDetails == null || gmid.length == 0) {
      showSnackbar("Invalid GMID", "error");
      setFormData((prevFormData: any) => {
        const updatedPrizes = [...prevFormData[prizeCategory]];

        updatedPrizes[index] = {
          ...updatedPrizes[index],

          name: "",
          college: "",
        };

        
        return {
          ...prevFormData,

          [prizeCategory]: updatedPrizes,
        };
      });
      return;
    }
    // console.log(participantDetails)

    setFormData((prevFormData: any) => {
      const updatedPrizes = [...prevFormData[prizeCategory]];

      updatedPrizes[index] = {
        ...updatedPrizes[index],

        name: participantDetails.name,
        college: participantDetails.cname,
        ccity:participantDetails.ccity,
        mobileNo:participantDetails.phone
      };

      return {
        ...prevFormData,

        [prizeCategory]: updatedPrizes,
      };
    });
  };

  const handleWinnersApproval = async (e: any) => {
    e.preventDefault();
    const response = await approveEventWinners(eventId);
    if (response) showSnackbar(response?.message, response?.type);
    setApprovalModalOpen(false);
    const fetchData = async () => {
      try {
        // Fetch event details
        const eventDetails = await getEventDetails(eventId);
        setEvent(eventDetails);

        // Fetch winners after event details are set
        const eventWinners = await getWinnersList(eventId);
        console.log(eventWinners);

        if (eventWinners) {
          setFormData((prev: any) => ({
            ...prev,
            firstPrize: eventWinners.firstPrize || prev.firstPrize,
            secondPrize: eventWinners.secondPrize || prev.secondPrize,
            thirdPrize: eventWinners.thirdPrize || prev.thirdPrize,
            firstPrizeTeamName: eventWinners.fname || prev.firstPrizeTeamName,
            secondPrizeTeamName: eventWinners.sname || prev.secondPrizeTeamName,
            thirdPrizeTeamName: eventWinners.tname || prev.thirdPrizeTeamName,
            approved: eventWinners.approved || false,
          }));
          let editable = false;
          if (role == "domain-coordinator" || role == "super-admin") {
            editable = true;
          }
          setEditable(editable);
          setIsUpdate(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showSnackbar("Error fetching data", "error");
      }
    };

    fetchData();
  };

  return (
    <div className="w-full h-full overflow-x-hidden">
      {event == null && <div>Loading...</div>}
      {event != null && (
        <div className="p-4 md:p-8">
          <button
            className="flex gap-2 border-2 rounded-lg border-accent-300 p-2"
            onClick={() => {
              setEditable(true);
              setFormData({
                firstPrize: [],
                secondPrize: [],
                thirdPrize: [],
              });
              navigate(-1);
            }}
          >
            <span>
              <ArrowLeftIcon className="h-6 w-6" />
            </span>
            Back
          </button>
          <div className="p-4 flex flex-col gap-2">
            <h1 className="text-xl text-text-950 text-center">
              Prize winners of{" "}
              <span className="font-semibold">{event.name}</span> (
              {event.eventtype} event)
            </h1>
            <form action="" className="overflow-x-auto">
              {/* First Prize */}
              <>
                <h2 className="text-lg font-semibold mt-4">
                  First prize (Winner)
                </h2>
                {/* For team events */}
                {event.eventtype === "Group" && (
                  <div className="flex justify-between">
                    <div className="flex gap-2 text-lg items-center">
                      <label htmlFor="">Team Name</label>
                      <input
                        type="text"
                        id="firstTeamName"
                        name="firstTeamName"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2"
                        required
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            firstPrizeTeamName: e.target.value,
                          }))
                        }
                        disabled={!editable || formData.approved}
                        defaultValue={formData.firstPrizeTeamName}
                      />
                    </div>
                    <div className="flex gap-2 text-lg items-center">
                      <label htmlFor="">Number of team members</label>
                      <input
                        type="number"
                        name="firstPrizeTeamCount"
                        id="firstPrizeTeamCount"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2"
                        required
                        onChange={(e: any) => {
                          let newLength = parseInt(e.target.value, 10) || 0;
                          let currentLength = formData.firstPrize.length;
                          let winners = [...formData.firstPrize];

                          if (newLength <= 0) {
                            winners = [];
                          } else if (newLength > currentLength) {
                            for (let i = currentLength; i < newLength; i++) {
                              winners.push({ gmid: "", college: "", name: "" });
                            }
                          } else if (newLength < currentLength) {
                            winners = winners.slice(0, newLength);
                          }

                          setFormData((prev: any) => ({
                            ...prev,
                            firstPrize: winners,
                          }));
                        }}
                        value={formData.firstPrize.length}
                        disabled={!editable || formData.approved}
                        step={1}
                      />
                    </div>
                  </div>
                )}
                <table className="w-full text-base rtl:text-right m-2 text-center">
                  <thead className=" text-text-900 uppercase bg-secondary-500">
                    <tr>
                      <th scope="col" className="px-2 py-3 md:px-6 md:py-3">
                        S.No
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 md:px-6 md:py-3 w-fit"
                      >
                        GMID
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 md:px-6 md:py-3 w-full"
                      >
                        Full Name
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 md:px-6 md:py-3 w-full"
                      >
                        Year and Department
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 md:px-6 md:py-3 w-full"
                      >
                        College
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 md:px-6 md:py-3 w-full"
                      >
                        Mobile No.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.firstPrize.map((prize: any, index: number) => (
                      <tr key={index} className="bg-white border-b">
                        <td className="px-2 py-4 md:px-6 md:py-4 w-fit">
                          {index + 1}
                        </td>
                        <td
                          scope="row"
                          className="px-2 py-4 md:px-6 md:py-4 font-medium text-text-900 whitespace-nowrap w-fit"
                        >
                          <input
                            type="text"
                            className={`${
                              !editable ? "hover:cursor-not-allowed" : ""
                            } border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2`}
                            value={prize.gmid}
                            onChange={(event) =>
                              handleGmidChange("firstPrize", index, event)
                            }
                            onBlur={(_e) => {
                              handleGetParticipantDetails("firstPrize", index);
                            }}
                            required={editable}
                            disabled={!editable || formData.approved}
                          />
                        </td>
                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.name}
                        </td>
                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.ccity}
                        </td>
                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.college}
                        </td>
                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.mobileNo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
              {/* Second Prize */}
              <>
                <h2 className="text-lg font-semibold mt-6">
                  Second prize (Runner)
                </h2>
                {event.eventtype === "Group" && (
                  <div className="flex justify-between">
                    <div className="flex gap-2 text-lg items-center">
                      <label htmlFor="">Team Name</label>
                      <input
                        type="text"
                        id="secondTeamName"
                        name="secondTeamName"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2"
                        required
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            secondPrizeTeamName: e.target.value,
                          }))
                        }
                        disabled={!editable || formData.approved}
                        value={formData.secondPrizeTeamName}
                      />
                    </div>
                    <div className="flex gap-2 text-lg items-center">
                      <label htmlFor="">Number of team members</label>
                      <input
                        type="number"
                        name="secondPrizeTeamCount"
                        id="secondPrizeTeamCount"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2"
                        required
                        onChange={(e: any) => {
                          let newLength = parseInt(e.target.value, 10) || 0;
                          let currentLength = formData.secondPrize.length;
                          let winners = [...formData.secondPrize];

                          if (newLength <= 0) {
                            winners = [];
                          } else if (newLength > currentLength) {
                            for (let i = currentLength; i < newLength; i++) {
                              winners.push({ gmid: "", college: "", name: "" });
                            }
                          } else if (newLength < currentLength) {
                            winners = winners.slice(0, newLength);
                          }

                          setFormData((prev: any) => ({
                            ...prev,
                            secondPrize: winners,
                          }));
                        }}
                        disabled={!editable || formData.approved}
                        value={formData.secondPrize.length}
                      />
                    </div>
                  </div>
                )}
                <table className="w-full text-base rtl:text-right m-2 text-center">
                  <thead className=" text-text-900 uppercase bg-secondary-500">
                    <tr>
                      <th scope="col" className="px-2 py-3 md:px-6 md:py-3">
                        S.No
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 md:px-6 md:py-3 w-fit"
                      >
                        GMID
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 md:px-6 md:py-3 w-full"
                      >
                        Full Name
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 md:px-6 md:py-3 w-full"
                      >
                        Year and Department
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 md:px-6 md:py-3 w-full"
                      >
                        College
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 md:px-6 md:py-3 w-full"
                      >
                        Mobile No.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.secondPrize.map((prize: any, index: number) => (
                      <tr key={index} className="bg-white border-b">
                        <td className="px-2 py-4 md:px-6 md:py-4 w-fit">
                          {index + 1}
                        </td>
                        <td
                          scope="row"
                          className="px-2 py-4 md:px-6 md:py-4 font-medium text-text-900 whitespace-nowrap w-fit"
                        >
                          <input
                            type="text"
                            className={`${
                              !editable ? "hover:cursor-not-allowed" : ""
                            } border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2`}
                            value={prize.gmid}
                            onChange={(event) =>
                              handleGmidChange("secondPrize", index, event)
                            }
                            onBlur={(_e) => {
                              handleGetParticipantDetails("secondPrize", index);
                            }}
                            required={editable}
                            disabled={!editable || formData.approved}
                          />
                        </td>
                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.name}
                        </td>
                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.ccity}
                        </td>
                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.college}
                        </td>
                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.mobileNo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
              {/* Third Prize */}
              <>
                <h2 className="text-lg font-semibold mt-4">Third prize</h2>
                {event.eventtype === "Group" && (
                  <div className="flex justify-between">
                    <div className="flex gap-2 text-lg items-center">
                      <label htmlFor="">Team Name</label>
                      <input
                        type="text"
                        id="eamName"
                        name="teamName"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2"
                        required
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            thirdPrizeTeamName: e.target.value,
                          }))
                        }
                        disabled={!editable || formData.approved}
                        value={formData.thirdPrizeTeamName}
                      />
                    </div>
                    <div className="flex gap-2 text-lg items-center">
                      <label htmlFor="">Number of team members</label>
                      <input
                        type="number"
                        name="firstPrizeTeamCount"
                        id="firstPrizeTeamCount"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2"
                        required
                        onChange={(e: any) => {
                          let newLength = parseInt(e.target.value, 10) || 0;
                          let currentLength = formData.thirdPrize.length;
                          let winners = [...formData.thirdPrize];

                          if (newLength <= 0) {
                            winners = [];
                          } else if (newLength > currentLength) {
                            for (let i = currentLength; i < newLength; i++) {
                              winners.push({ gmid: "", college: "", name: "" });
                            }
                          } else if (newLength < currentLength) {
                            winners = winners.slice(0, newLength);
                          }

                          setFormData((prev: any) => ({
                            ...prev,
                            thirdPrize: winners,
                          }));
                        }}
                        disabled={!editable || formData.approved}
                        value={formData.thirdPrize.length}
                      />
                    </div>
                  </div>
                )}
                <table className="w-full text-base rtl:text-right m-2 text-center">
                  <thead className=" text-text-900 uppercase bg-secondary-500">
                    <tr>
                      <th scope="col" className="px-2 py-3 md:px-6 md:py-3">
                        S.No
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 md:px-6 md:py-3 w-fit"
                      >
                        GMID
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 md:px-6 md:py-3 w-full"
                      >
                        Full Name
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 md:px-6 md:py-3 w-full"
                      >
                        Year and Department
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 md:px-6 md:py-3 w-full"
                      >
                        College
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 md:px-6 md:py-3 w-full"
                      >
                        Mobile No.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.thirdPrize.map((prize: any, index: number) => (
                      <tr key={index} className="bg-white border-b">
                        <td className="px-2 py-4 md:px-6 md:py-4 w-fit">
                          {index + 1}
                        </td>
                        <td
                          scope="row"
                          className="px-2 py-4 md:px-6 md:py-4 font-medium text-text-900 whitespace-nowrap w-fit"
                        >
                          <input
                            type="text"
                            className={`${
                              !editable ? "hover:cursor-not-allowed" : ""
                            } border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2`}
                            value={prize.gmid}
                            onChange={(event) =>
                              handleGmidChange("thirdPrize", index, event)
                            }
                            onBlur={(_e) => {
                              handleGetParticipantDetails("thirdPrize", index);
                            }}
                            required={editable}
                            disabled={!editable || formData.approved}
                          />
                        </td>
                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.name}
                        </td>
                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.ccity}
                        </td>
                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.college}
                        </td>
                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.mobileNo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
              {/* Action Buttons */}
              {editable && (
                <div className="w-full flex justify-end gap-2 mt-4">
                  <button
                    className="rounded-lg px-2 py-1 border-2 border-accent-200 md:px-4 md:py-2 hover:scale-95"
                    onClick={handleClearButton}
                    disabled={!editable || formData.approved}
                  >
                    Clear
                  </button>
                  <button
                    className="rounded-lg px-2 py-1 bg-green-600 text-white md:px-4 md:py-2 hover:scale-95"
                    type="submit"
                    onClick={(e: any) => {
                      e.preventDefault();
                      setModalOpen(true);
                    }}
                    disabled={!editable || formData.approved}
                  >
                    Save
                  </button>
                  {/* Only render the Approve Winners button if winners are not approved */}
                  {(role === "domain-coordinator" || role === "super-admin") &&
                    formData.firstPrize[0]?.gmid &&
                    isUpdate &&
                    !formData.approved && (
                      <button
                        className="rounded-lg px-2 py-1 bg-primary-600 text-white md:px-4 md:py-2 hover:scale-95"
                        onClick={(e: any) => {
                          e.preventDefault();
                          setApprovalModalOpen(true);
                        }}
                      >
                        Approve Winners
                      </button>
                    )}
                </div>
              )}
            </form>
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
            <h3 className="text-lg font-black text-gray-800">
              Confirm Winners
            </h3>
            <p className="text-sm text-text-500">
              Are you sure you want to upload winners for{" "}
              <span className="font-bold text-text-700">{event?.name}</span>{" "}
              event?
            </p>
            <p>You cannot change once submitted</p>
          </div>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-green-600 rounded-lg w-full text-white"
              onClick={handleWinnersUpload}
            >
              Save
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
      <Modal
        open={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
      >
        <div className="text-center w-56">
          <CheckIcon className="size-32 mx-auto text-green-500" />
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black text-gray-800">
              Confirm Winners
            </h3>
            <p className="text-sm text-text-500">
              Are you sure you want to declare winners for{" "}
              <span className="font-bold text-text-700">{event?.name}</span>{" "}
              event?
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-green-600 rounded-lg w-full text-white"
              onClick={handleWinnersApproval}
            >
              Approve
            </button>
            <button
              className="px-4 py-2 bg-accent-100 rounded-lg w-full"
              onClick={() => setApprovalModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventWinners;
