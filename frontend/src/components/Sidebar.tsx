import {
  XMarkIcon,
  ArrowLeftStartOnRectangleIcon,
  UserPlusIcon,
  TrophyIcon,
  UserGroupIcon,
  IdentificationIcon,
  PlusCircleIcon,
  CurrencyRupeeIcon
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../services/useAuth";
import Modal from "./util_components/Modal";
import { useState } from "react";
import { rolePermissions } from "../services/RequireAuth";

const unselectedStyle =
  "px-4 py-2 my-1 w-full text-text-50 bg-secondary-100/0 hover:bg-secondary-100 hover:text-text-950 rounded-lg cursor-pointer flex gap-2";
const selectedStyle =
  "px-4 py-2 my-1 w-full bg-secondary-100/100 text-text-950 rounded-lg cursor-pointer flex gap-2";

const navItems = [
  {
    name: "Events Attendance",
    icon: <UserPlusIcon className="size-6" />,
    url: "/dashboard/event-attendance",
    allowedRoles : ["super-admin", "event-coordinator"]
  },
  {
    name: "Event Winners",
    icon: <TrophyIcon className="size-6" />,
    url: "/dashboard/winners",
    allowedRoles : ["super-admin", "event-coordinator"]
  },
  {
    name: "Workshop Attendance",
    icon: <UserPlusIcon className="size-6" />,
    url: "/dashboard/workshop-attendance",
    allowedRoles : ["super-admin", "workshop-coordinator"]
  },
  {
    name: "College Participants",
    icon: <UserGroupIcon className="size-6" />,
    url: "/dashboard/participants",
    allowedRoles : ["super-admin", "certificate-committee"]
  },
  {
    name: "Participant Information",
    icon: <IdentificationIcon className="size-6" />,
    url: "/dashboard/participant-info",
    allowedRoles : ["super-admin", "event-coordinator", "workshop-coordinator", "certificate-committee"]
  },
  {
    name: "On the Spot Registration",
    icon: <PlusCircleIcon className="size-6" />,
    url: "/dashboard/on-spot-registration",
    allowedRoles : ["super-admin", "registration-committee"]
  },
  {
    name: "Payment Update",
    icon: <CurrencyRupeeIcon className="size-6" />,
    url: "/dashboard/payment-update",
  },
  {
    name: "Payment Details",
    icon: <CurrencyRupeeIcon className="size-6" />,
    url: "/dashboard/payment-details",
  },
];

const Sidebar = ({ setIsOpen }: any) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const {logout, authed} = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = async (e:any) => {
    e.preventDefault();  
    
    if(authed){
      logout();
      navigate("/");
    }

  }

  const {role} = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`bg-background-900 text-white flex flex-col min-w-72`}>
        {/* Toggle Button */}
        <button
          className="text-white p-4 focus:outline-none lg:hidden justify-end"
          onClick={() => setIsOpen(false)}
        >
          <XMarkIcon className="size-8" />
        </button>

        {/* Menu Items */}
        <nav className="flex-grow min-h-full">
          <h1 className="p-4 text-xl">GyanMitra' 25</h1>
          <ul className="space-y-4 mt-8 p-2 md:mr-8">
            {navItems.map((item, idx) => {
              const isActive = location.pathname.includes(item.url); // Check if the current path matches the item's URL
              // console.log(item.allowedRoles.includes(role));
              // console.log("permission");              
              // console.log(rolePermissions[role]);
              // console.log(rolePermissions[role].includes(item.url));
              // console.log(item.url);
              
              return (
                // item.allowedRoles.includes(role) && 
                (rolePermissions[role].includes(item.url) || role == "super-admin") && 
                <li
                  key={idx}
                  className={`transition-all duration-100 ease-in-out ${isActive ? selectedStyle : unselectedStyle}`}
                  onClick={() => {
                    navigate(item.url);
                    setIsOpen(false);
                  }}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </li>
              );
            })}
            <hr />
            <li className="px-4 py-2 my-1 w-full text-text-50 hover:bg-red-500 hover:text-text-950 rounded-lg cursor-pointer flex gap-2"
            onClick={() => setModalOpen(true)}>
              <span>
                <ArrowLeftStartOnRectangleIcon className="size-6" />
              </span>{" "}
              Logout
            </li>
          </ul>
        </nav>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="text-center w-56">
          <ArrowLeftStartOnRectangleIcon className="size-32 mx-auto text-red-500" />
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black text-gray-800">Confirm Logout</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to logout?
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-red-600 rounded-lg w-full text-white" onClick={handleLogout}>Logout</button>
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

export default Sidebar;