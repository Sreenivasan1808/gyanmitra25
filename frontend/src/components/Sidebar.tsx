import {
  XMarkIcon,
  ArrowLeftStartOnRectangleIcon,
  UserPlusIcon,
  TrophyIcon,
  UserGroupIcon,
  IdentificationIcon
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../services/useAuth";

const unselectedStyle =
  "px-4 py-2 my-1 w-full text-text-50 hover:bg-secondary-100 hover:text-text-950 rounded-lg cursor-pointer flex gap-2";
const selectedStyle =
  "px-4 py-2 my-1 w-full bg-secondary-100 text-text-950 rounded-lg cursor-pointer flex gap-2";

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
];

const Sidebar = ({ setIsOpen }: any) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const {logout, authed} = useAuth();

  const handleLogout = async (e:any) => {
    e.preventDefault();
    console.log("Authed");
    console.log(authed);
    
    
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
          <h1 className="p-4 text-xl">Admin Dashboard</h1>
          <ul className="space-y-4 mt-8 p-2 md:mr-8">
            {navItems.map((item, idx) => {
              const isActive = location.pathname.includes(item.url); // Check if the current path matches the item's URL
              return (
                item.allowedRoles.includes(role) && 
                <li
                  key={idx}
                  className={isActive ? selectedStyle : unselectedStyle}
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
            onClick={handleLogout}>
              <span>
                <ArrowLeftStartOnRectangleIcon className="size-6" />
              </span>{" "}
              Logout
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;