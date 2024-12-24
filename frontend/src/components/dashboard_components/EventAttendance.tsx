import React, { useState } from "react";
import EventsList from "./EventsList";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const EventAttendance = () => {
  const [event, setEvent] = useState<{
    id: number;
    name: String;
    imgSrc: string;
  } | null>(null);
  return (
    <div className="w-full h-full overflow-scroll">
      {event === null && (
        <div>
          <h1 className="p-8 text-2xl">Event Attendance</h1>
          <EventsList setEvent={setEvent} />
        </div>
      )}
      {event != null && (
        <div className="p-8">
          <button
            className="flex gap-2 border-2 rounded-lg border-accent-300 p-2"
            onClick={() => {
              setEvent(null);
            }}
          >
            <span>
              <ArrowLeftIcon className="size-6" />
            </span>
            Back
          </button>
          <div className="p-4 flex flex-col gap-2">
            <h1 className="text-lg text-text-950 ">
              Event name: <span className="text-text-950 font-semibold">{event.name}</span>
            </h1>

            {/* Attendance form */}
            <form
              action=""
              className="flex md:flex-col border-2 rounded-lg border-accent-300 p-4"
            >
              <div className="flex gap-4 p-4 justify-between">
                <div className="flex flex-col gap-1">
                  <label htmlFor="gmid">GMID</label>
                  <input
                    type="text"
                    id="gmid"
                    name="gmid"
                    className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-2"
                    autoFocus
                  />
                </div>
                <div className="flex flex-col gap-1 w-72">
                  <label htmlFor="gmid">Full Name</label>
                  <input
                    type="text"
                    id="fname"
                    name="fname"
                    disabled
                    className="hover:cursor-not-allowed border-2 rounded-lg outline-none p-2"
                  />
                </div>
                <div className="flex flex-col gap-1 w-72">
                  <label htmlFor="gmid">College</label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    disabled
                    className="hover:cursor-not-allowed border-2 rounded-lg outline-none p-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button className="rounded-lg px-4 py-2 bg-secondary-600 text-white">
                  Get Details
                </button>
                <button
                  className="rounded-lg px-4 py-2 bg-green-600 text-white"
                  disabled
                >
                  Mark as present
                </button>
              </div>
            </form>

            {/* Table displaying list of participants marked as present */}
            <div className="flex justify-between mt-4 items-center">
              <h1 className="text-lg mt-4">List of present participants</h1>
              <button className="rounded-lg px-4 py-2 bg-primary-600 text-white">
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
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 w-fit">1</td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-text-900 whitespace-nowrap w-fit"
                  >
                    gm1000
                  </td>
                  <td className="px-6 py-4 w-full">Silver</td>
                  <td className="px-6 py-4 w-full">Laptop</td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 w-fit">2</td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap w-fit"
                  >
                    gm1001
                  </td>
                  <td className="px-6 py-4 w-full">White</td>
                  <td className="px-6 py-4 w-full">Laptop PC</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="px-6 py-4 w-fit">3</td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap w-fit"
                  >
                    gm1002
                  </td>
                  <td className="px-6 py-4 w-full">Black</td>
                  <td className="px-6 py-4 w-full">Accessories</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAttendance;
