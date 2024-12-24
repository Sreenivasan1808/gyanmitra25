import React, { useState } from "react";
import EventsList from "./EventsList";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const EventWinners = () => {
  const [event, setEvent] = useState<{
    id: number;
    name: String;
    imgSrc: string;
  } | null>(null);
  return (
    <div className="w-full h-full overflow-scroll">
      {event === null && (
        <div>
          <h1 className="p-8 text-2xl">Event Winners</h1>
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
              Event name: <span className="font-semibold">{event.name}</span>
            </h1>
            <form action="">
              <h2 className="text-lg font-semibold mt-4">
                First prize (Winner)
              </h2>
              <table className="w-full text-base rtl:text-right m-2 text-center">
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
                      <input
                        type="text"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-2"
                      />
                    </td>
                    <td className="px-6 py-4 w-full">Silver</td>
                    <td className="px-6 py-4 w-full">Laptop</td>
                  </tr>
                  <tr className="bg-white border-b">
                    <td className="px-6 py-4 w-fit">2</td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap w-fit"
                    >
                      <input
                        type="text"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-2"
                      />
                    </th>
                    <td className="px-6 py-4 w-full">White</td>
                    <td className="px-6 py-4 w-full">Laptop PC</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4 w-fit">3</td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap w-fit"
                    >
                      <input
                        type="text"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-2"
                      />
                    </th>
                    <td className="px-6 py-4 w-full">Black</td>
                    <td className="px-6 py-4 w-full">Accessories</td>
                  </tr>
                </tbody>
              </table>
              <h2 className="text-lg font-semibold mt-4">
                Second prize (Runner)
              </h2>
              <table className="w-full text-base rtl:text-right m-2 text-center">
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
                      <input
                        type="text"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-2"
                      />
                    </td>
                    <td className="px-6 py-4 w-full">Silver</td>
                    <td className="px-6 py-4 w-full">Laptop</td>
                  </tr>
                  <tr className="bg-white border-b">
                    <td className="px-6 py-4 w-fit">2</td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap w-fit"
                    >
                      <input
                        type="text"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-2"
                      />
                    </th>
                    <td className="px-6 py-4 w-full">White</td>
                    <td className="px-6 py-4 w-full">Laptop PC</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4 w-fit">3</td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap w-fit"
                    >
                      <input
                        type="text"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-2"
                      />
                    </th>
                    <td className="px-6 py-4 w-full">Black</td>
                    <td className="px-6 py-4 w-full">Accessories</td>
                  </tr>
                </tbody>
              </table>
              <h2 className="text-lg font-semibold mt-4">Third prize</h2>
              <table className="w-full text-base rtl:text-right m-2 text-center">
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
                      <input
                        type="text"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-2"
                      />
                    </td>
                    <td className="px-6 py-4 w-full">Silver</td>
                    <td className="px-6 py-4 w-full">Laptop</td>
                  </tr>
                  <tr className="bg-white border-b">
                    <td className="px-6 py-4 w-fit">2</td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap w-fit"
                    >
                      <input
                        type="text"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-2"
                      />
                    </th>
                    <td className="px-6 py-4 w-full">White</td>
                    <td className="px-6 py-4 w-full">Laptop PC</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4 w-fit">3</td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap w-fit"
                    >
                      <input
                        type="text"
                        className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-2"
                      />
                    </th>
                    <td className="px-6 py-4 w-full">Black</td>
                    <td className="px-6 py-4 w-full">Accessories</td>
                  </tr>
                </tbody>
              </table>

              <div className="w-full flex justify-end gap-4 mt-4">
                <button className="rounded-lg px-4 py-2 border-2 border-accent-200">
                  Clear
                </button>
                <button className="rounded-lg px-4 py-2 bg-green-600 text-white">
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
