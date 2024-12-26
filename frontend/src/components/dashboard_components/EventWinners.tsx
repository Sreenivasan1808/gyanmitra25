import React, { useState } from "react";
import EventsList from "./EventsList";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getParticipantDetailsFromGMID } from "../../services/ParticipantSVC";

const EventWinners = () => {
  const [event, setEvent] = useState<{
    id: number;
    name: String;
    imgSrc: string;
  } | null>(null);

  const [formData, setFormData] = useState({
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

  //Upload the winners list for this event
  const handleWinnersUpload = async () => {
    
  };

  //Clear all forms
  const handleClearButton = () => {};

  const handleGmidChange = (prizeCategory: any, index: any, event: any) => {
    const newGmid = event.target.value;

    // Update the state immutably

    setFormData((prevFormData) => {
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
    let participantDetails = await getParticipantDetailsFromGMID(gmid);
    // console.log(participantDetails)

    setFormData((prevFormData) => {
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
      {event === null && (
        <div>
          <h1 className="p-8 text-2xl">Event Winners</h1>
          <EventsList setEvent={setEvent} />
        </div>
      )}
      {event != null && (
        <div className="p-4 md:p-8">
          <button
            className="flex gap-2 border-2 rounded-lg border-accent-300 p-2"
            onClick={() => {
              setEvent(null);
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
              <span className="font-semibold">{event.name}</span>
            </h1>
            <form action="" className="overflow-x-auto">
              {/* First Prize  */}
              <h2 className="text-lg font-semibold mt-4">
                First prize (Winner)
              </h2>
              <table className="w-full text-base rtl:text-right m-2 text-center">
                <thead className=" text-text-900 uppercase bg-secondary-500">
                  <tr>
                    <th scope="col" className="px-2 py-3 md:px-6 md:py-3">
                      S.No
                    </th>
                    <th scope="col" className="px-2 py-3 md:px-6 md:py-3 w-fit">
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
                  {formData.firstPrize.map((prize, index) => (
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
                          className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2"
                          value={prize.gmid}
                          onChange={(event) =>
                            handleGmidChange("firstPrize", index, event)
                          } // Pass index to the handler
                          onBlur={(e) => {
                            handleGetParticipantDetails("firstPrize", index);
                          }}
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

              <h2 className="text-lg font-semibold mt-4">
                Second prize (Runner)
              </h2>
              <table className="w-full text-base rtl:text-right m-2 text-center">
                <thead className=" text-text-900 uppercase bg-secondary-500">
                  <tr>
                    <th scope="col" className="px-2 py-3 md:px-6 md:py-3">
                      S.No
                    </th>
                    <th scope="col" className="px-2 py-3 md:px-6 md:py-3 w-fit">
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
                  {formData.secondPrize.map((prize, index) => (
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
                          className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2"
                          value={prize.gmid}
                          onChange={(event) =>
                            handleGmidChange("secondPrize", index, event)
                          } // Pass index to the handler
                          onBlur={(e) => {
                            handleGetParticipantDetails("secondPrize", index);
                          }}
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
              <h2 className="text-lg font-semibold mt-4">Third prize</h2>
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
                  {formData.thirdPrize.map((prize, index) => (
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
                          className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-1 md:p-2"
                          value={prize.gmid}
                          onChange={(event) =>
                            handleGmidChange("thirdPrize", index, event)
                          } // Pass index to the handler
                          onBlur={(e) => {
                            handleGetParticipantDetails("thirdPrize", index);
                          }}
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

              <div className="w-full flex justify-end gap-2 mt-4">
                <button
                  className="rounded-lg px-2 py-1 border-2 border-accent-200 md:px-4 md:py-2"
                  onClick={handleClearButton}
                >
                  Clear
                </button>
                <button
                  className="rounded-lg px-2 py-1 bg-green-600 text-white md:px-4 md:py-2"
                  onClick={handleWinnersUpload}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventWinners;
