import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getParticipantDetailsFromGMID } from "../../services/ParticipantSVC";
import Snackbar from "../util_components/Snackbar";
import { getWinnersList, uploadWinners } from "../../services/WinnersSVC";
import { useNavigate, useParams } from "react-router-dom";
import { getEventDetails } from "../../services/EventsSVC";
import useAuth from "../../services/useAuth";

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

  const navigate = useNavigate();

  const {role} = useAuth()

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
  });

  //Upload the winners list for this event
  const handleWinnersUpload = async (e: any) => {
    e.preventDefault();
    if (event != null) {
      let winnersIds = {
        firstPrize: formData.firstPrize.map((item: any) => item.gmid),
        secondPrize: formData.secondPrize.map((item: any) => item.gmid),
        thirdPrize: formData.thirdPrize.map((item: any) => item.gmid),
        firstPrizeTeamName: formData.firstPrizeTeamName,
        secondPrizeTeamName: formData.secondPrizeTeamName,
        thirdPrizeTeamName: formData.thirdPrizeTeamName
      };
      let status = await uploadWinners(winnersIds, event?.eventid);
      showSnackbar(status?.message, status?.type);
    }
  };

  const [editable, setEditable] = useState(true);

  //Get winners details if already declared
  // const handleFetchWinnersData = async () => {
  //   if (event == null) return;
  //   const eventWinners = await getWinnersList(eventId);
  //   if(eventWinners == null){
  //     setEditable(true);
  //     return;
  //   }
  //   console.log("Event winners")
  //   console.log(eventWinners);
  //   setFormData((prev) => {
  //     let firstPrize = prev.firstPrize;
  //     let secondPrize = prev.secondPrize;
  //     let thirdPrize = prev.thirdPrize;

  //     for(let i = 0; i < eventWinners.firstPrize.length; i++){
  //       firstPrize[i] = {...eventWinners.firstPrize[i]};
  //     }
  //     for(let i = 0; i < eventWinners.secondPrize.length; i++){
  //       secondPrize[i] = {...eventWinners.secondPrize[i]};
  //     }
  //     for(let i = 0; i < eventWinners.thirdPrize.length; i++){
  //       thirdPrize[i] = {...eventWinners.thirdPrize[i]};
  //     }

  //     setEditable(false);

  //     return {
  //       firstPrize: firstPrize,
  //       secondPrize: secondPrize,
  //       thirdPrize: thirdPrize
  //     }
  //   })
  // };

  // const handleGetEventDetails = async () => {
  //   const eventDetails = await getEventDetails(eventId);
  //   setEvent(eventDetails);
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event details
        const eventDetails = await getEventDetails(eventId);
        setEvent(eventDetails);

        // Fetch winners after event details are set
        const eventWinners = await getWinnersList(eventId);
        if (eventWinners) {
          setFormData((prev: any) => ({
            ...prev,
            firstPrize: eventWinners.firstPrize || prev.firstPrize,
            secondPrize: eventWinners.secondPrize || prev.secondPrize,
            thirdPrize: eventWinners.thirdPrize || prev.thirdPrize,
            firstPrizeTeamName: eventWinners.fname || prev.firstPrizeTeamName,
            secondPrizeTeamName: eventWinners.sname || prev.secondPrizeTeamName,
            thirdPrizeTeamName: eventWinners.tname || prev.thirdPrizeTeamName
          }));
          let editable = false;
          if(role == "domain-coordinator" || role == "super-admin"){
            editable = true;
          }
          setEditable(editable);
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
        { gmid: "", name: "", college: "" },
        { gmid: "", name: "", college: "" },
        { gmid: "", name: "", college: "" },
      ],
      secondPrize: [
        { gmid: "", name: "", college: "" },
        { gmid: "", name: "", college: "" },
        { gmid: "", name: "", college: "" },
      ],
      thirdPrize: [
        { gmid: "", name: "", college: "" },
        { gmid: "", name: "", college: "" },
        { gmid: "", name: "", college: "" },
      ],
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
      };

      return {
        ...prevFormData,

        [prizeCategory]: updatedPrizes,
      };
    });
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
              {/* First Prize  */}
              <>
                <h2 className="text-lg font-semibold mt-4">
                  First prize (Winner)
                </h2>

                {/* For team events*/}
                {event.eventtype == "Group" && (
                  <div className="flex justify-between">
                    <div className="flex gap-2 text-lg items-center">
                      <label htmlFor="">Team Name</label>
                      <input
                        type="text"
                        id="firstTeamName"
                        name="firstTeamName"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2"
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            firstPrizeTeamName: e.target.value,
                          }))
                        }
                        disabled={!editable}
                        value={formData.firstPrizeTeamName}
                      />
                    </div>
                    <div className="flex gap-2 text-lg items-center">
                      <label htmlFor="">Number of team members</label>
                      <input
                        type="number"
                        name="firstPrizeTeamCount"
                        id="firstPrizeTeamCount"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2"
                        onChange={(e: any) => {
                          let length = e.target.value;
                          let winners = formData.firstPrize;
                          if (length == 0 || length == null) {
                            winners = [];
                          } else if (winners.length < length) {
                            let n = length - winners.length;
                            for (let i = 1; i <= n; i++) {
                              winners = winners.concat({
                                gmid: "",
                                college: "",
                                name: "",
                              });
                            }
                          } else {
                            winners = winners.slice(0, length - 1);
                          }
                          setFormData((prev: any) => {
                            return {
                              ...prev,
                              firstPrize: winners,
                            };
                          });
                        }}
                        value={formData.firstPrize.length}
                        disabled={!editable}
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
                        College
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
                              editable == false
                                ? "hover:cursor-not-allowed"
                                : ""
                            } border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2`}
                            value={prize.gmid}
                            onChange={(event) =>
                              handleGmidChange("firstPrize", index, event)
                            } // Pass index to the handler
                            onBlur={(_e) => {
                              handleGetParticipantDetails("firstPrize", index);
                            }}
                            required={index == 0}
                            disabled={!editable}
                          />
                        </td>

                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.name}
                        </td>

                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.college}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
              {/* Second Prize  */}
              <>
                <h2 className="text-lg font-semibold mt-6">
                  Second prize (Runner)
                </h2>
                {/* For team events*/}
                {event.eventtype == "Group" && (
                  <div className="flex justify-between">
                    <div className="flex gap-2 text-lg items-center">
                      <label htmlFor="">Team Name</label>
                      <input
                        type="text"
                        id="secondTeamName"
                        name="secondTeamName"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2"
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            secondPrizeTeamName: e.target.value,
                          }))
                        }
                        disabled={!editable}
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
                        onChange={(e: any) => {
                          let length = e.target.value;
                          let winners = formData.secondPrize;
                          if (
                            length == 0 ||
                            length == null ||
                            length == undefined
                          ) {
                            winners = [
                              {
                                gmid: "",
                                college: "",
                                name: "",
                              },
                            ];
                          } else if (winners.length < length) {
                            let n = length - winners.length;
                            for (let i = 1; i <= n; i++) {
                              winners = winners.concat({
                                gmid: "",
                                college: "",
                                name: "",
                              });
                            }
                          } else {
                            winners = winners.slice(0, length - 1);
                          }
                          setFormData((prev: any) => {
                            return {
                              ...prev,
                              secondPrize: winners,
                            };
                          });
                        }}
                        disabled={!editable}
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
                        College
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
                              editable == false
                                ? "hover:cursor-not-allowed"
                                : ""
                            } border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2`}
                            value={prize.gmid}
                            onChange={(event) =>
                              handleGmidChange("secondPrize", index, event)
                            } // Pass index to the handler
                            onBlur={(_e) => {
                              handleGetParticipantDetails("secondPrize", index);
                            }}
                            required={index == 0}
                            disabled={!editable}
                          />
                        </td>

                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.name}
                        </td>

                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.college}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
              {/* Third Prize  */}
              <>
                <h2 className="text-lg font-semibold mt-4">Third prize</h2>
                {event.eventtype == "Group" && (
                  <div className="flex justify-between">
                    <div className="flex gap-2 text-lg items-center">
                      <label htmlFor="">Team Name</label>
                      <input
                        type="text"
                        id="eamName"
                        name="teamName"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2"
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            thirdPrizeTeamName: e.target.value,
                          }))
                        }
                        disabled={!editable}
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
                        onChange={(e: any) => {
                          let length = e.target.value;
                          let winners = formData.thirdPrize;
                          if (length == 0 || length == null) {
                            winners = [];
                          } else if (winners.length < length) {
                            let n = length - winners.length;
                            for (let i = 1; i <= n; i++) {
                              winners = winners.concat({
                                gmid: "",
                                college: "",
                                name: "",
                              });
                            }
                          } else {
                            winners = winners.slice(0, length - 1);
                          }
                          setFormData((prev: any) => {
                            return {
                              ...prev,
                              thirdPrize: winners,
                            };
                          });
                        }}
                        disabled={!editable}
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
                        className=" px-2 py-3 md:px-6 md:py-3 w-fit"
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
                        College
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
                              editable == false
                                ? "hover:cursor-not-allowed"
                                : ""
                            } border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2`}
                            value={prize.gmid}
                            onChange={(event) =>
                              handleGmidChange("thirdPrize", index, event)
                            } // Pass index to the handler
                            onBlur={(_e) => {
                              handleGetParticipantDetails("thirdPrize", index);
                            }}
                            required={index == 0}
                            disabled={!editable}
                          />
                        </td>

                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.name}
                        </td>

                        <td className="px-2 py-4 md:px-6 md:py-4 w-full">
                          {prize.college}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>

              {editable && (
                <div className="w-full flex justify-end gap-2 mt-4">
                  <button
                    className="rounded-lg px-2 py-1 border-2 border-accent-200 md:px-4 md:py-2 hover:scale-95"
                    onClick={handleClearButton}
                  >
                    Clear
                  </button>
                  <button
                    className="rounded-lg px-2 py-1 bg-green-600 text-white md:px-4 md:py-2 hover:scale-95"
                    onClick={handleWinnersUpload}
                  >
                    Save
                  </button>
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
    </div>
  );
};

export default EventWinners;
