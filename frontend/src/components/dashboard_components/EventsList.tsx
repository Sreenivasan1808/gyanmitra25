import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEventListByDept } from "../../services/EventsSVC";
import useAuth from "../../services/useAuth";
import { getAllDepartmentList } from "../../services/ParticipantSVC";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const EventsList = ({ targetPath, heading }: any) => {
  const navigate = useNavigate();
  const [eventList, setEventList] = useState<any[]>([]);
  const { dept, role } = useAuth();
  const [department, setDepartment] = useState("");
  const [deptList, setDeptList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  // Handle department selection
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(event.target.value);
    console.log("Selected Department:", event.target.value);
  };

  // Handle search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter events based on search query
  const filterEvents = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = eventList.filter((event) =>
      event.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredEvents(filtered);
  };

  // First useEffect: Set department based on role
  useEffect(() => {
    const handleGetDepartmentList = async () => {
      if (role === "super-admin") {
        const departments = await getAllDepartmentList();
        setDeptList(departments || []);
      } else {
        setDepartment(dept);
      }
    };
    handleGetDepartmentList();
  }, [role, dept]);

  // Second useEffect: Fetch event list when department changes
  useEffect(() => {
    if (!department) return;

    const handleGetAllEventList = async () => {
      const data = await getAllEventListByDept(department);
      if (data.message) {
        console.log(data);
        return;
      }
      setEventList(data);
    };

    handleGetAllEventList();
  }, [department]);

  // Effect to filter events when search query changes
  useEffect(() => {
    filterEvents();
  }, [searchQuery, eventList]);

  return (
    <div className="px-8 py-2">
      {role === "super-admin" && (
        <div className="flex flex-col justify-between mb-4 gap-2">
          <label htmlFor="dept">Department</label>
          <select
            name="dept"
            id="dept"
            className="w-80 h-fit bg-white border-2 rounded-lg focus:border-accent-400 px-4 py-2"
            value={department}
            onChange={handleSelect}
          >
            <option value="">Select the department</option>
            {deptList.length > 0 ? (
              deptList.map((item: any) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))
            ) : (
              <option value="">No Departments Available</option>
            )}
          </select>
        </div>
      )}

      <h1 className="text-center text-xl">{heading}</h1>
      <h2 className="text-lg text-text-800">
        Events conducted by:{" "}
        <span className="font-semibold text-text-950">{department}</span>
      </h2>

      {/* Search Section */}
      <div className="relative mb-4 w-full">
      <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by event name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="focus:ring-0 focus:outline-none w-full p-2 pl-10 border-2 rounded-lg focus:border-accent-400 "
        />
      </div>

      {/* Display filtered events */}
      <div className="flex justify-center flex-wrap gap-4 p-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event: any) => (
            <div
              className="h-72 w-72 border-2 flex flex-col justify-between items-center border-accent-400 rounded-lg hover:scale-95 transition-all duration-200 hover:border-accent-600 text-lg hover:cursor-pointer"
              onClick={() => navigate(`/dashboard/${targetPath}/${event.eventid}`)}
              key={event.eventid}
            >
              <img
                src={event.images}
                alt={event.name}
                className="h-full w-full rounded-t-md"
              />
              <p className="w-full bg-secondary-200 text-center rounded-b-md">
                {event.name}
              </p>
            </div>
          ))
        ) : (
          <p>No events found</p>
        )}
      </div>
    </div>
  );
};

export default EventsList;
