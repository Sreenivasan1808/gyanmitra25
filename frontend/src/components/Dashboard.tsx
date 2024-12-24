import React, { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar";
import EventAttendance from "./dashboard_components/EventAttendance";
import EventWinners from "./dashboard_components/EventWinners";

const pages = [<EventAttendance />, <EventWinners />];

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className="min-h-screen bg-background-50 flex relative overflow-hidden">
      {/* Sidebar */}
      <div
        className={`min-h-screen z-20 transform md:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 fixed md:static md:w-[20%] overflow-hidden`}
      >
        <Sidebar
          setIsOpen={setIsOpen}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        ></Sidebar>
      </div>

      {/* Overlay (only for small screens) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="w-full md:w-[80%] h-screen flex flex-col">
        {/* Header */}
        <div className="w-full bg-background-100 p-2 text-xl text-text-800 font-semibold flex justify-between items-center px-4">
          <h2>Vipravuha</h2>
          <span
            className="md:hidden cursor-pointer"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <Bars3Icon className="w-8 h-8" />
          </span>
        </div>
        {/* Main Page */}
        <div className=" max-h-screen pb-4">{pages[currentPage]}</div>
      </div>
    </div>
  );
};

export default Dashboard;
