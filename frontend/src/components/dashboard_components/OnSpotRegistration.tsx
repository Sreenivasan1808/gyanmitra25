import { useState } from "react";
import Accordian, { AccordianItem } from "../util_components/Accordian";
import { retrieveRegistrationFormResponses } from "../../services/RegistrationSVC";

const OnSpotRegistration = () => {
  const [formResponses, setFormResponses] = useState<any>();

  const handleFetchFormRespones = async (e: any) => {
    e.preventDefault();
    const responses = await retrieveRegistrationFormResponses();
  };
  return (
    <div className="px-8 py-2 flex flex-col justify-center items-center w-full gap-4">
      <div className="p-4 border-2 border-accent-300 rounded-lg w-full">
        <h2 className="text-lg font-semibold">Please read this..</h2>
        <ul className="list-disc px-2">
          <li>Press the button named <span className="font-semibold">Fetch Registration Requests</span></li>
          <li>It retrieves the all the responses of the Google Form</li>
          <li>
            Recieve payment from the participant and only then approve them here{" "}
          </li>
          <li>
            To approve or reject a college select the participants and click on
            approve or reject{" "}
          </li>
        </ul>
      </div>
      <div className="w-full flex justify-end">
        <button
          className="px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-all duration-100 ease-in-out"
          onClick={handleFetchFormRespones}
        >
          Fetch Registration Requests
        </button>
      </div>
      <Accordian className="w-full">
        <AccordianItem value="1" trigger="Item 1">
          Item 1
        </AccordianItem>
        <AccordianItem value="2" trigger="Item 2">
          Item 2
        </AccordianItem>
        <AccordianItem value="3" trigger="Item 3">
          Item 3
        </AccordianItem>
      </Accordian>
    </div>
  );
};

export default OnSpotRegistration;
