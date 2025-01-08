import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllWorkshopListByDept } from "../../services/EventsSVC";
import { getAllDepartmentList } from "../../services/ParticipantSVC";
import useAuth from "../../services/useAuth";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const WorkshopList = () => {
  const navigate = useNavigate();
  const [workshopList, setWorkshopList] = useState<any[]>([]);
  const [filteredWorkshopList, setFilteredWorkshopList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptList, setDeptList] = useState<any[]>([]);
  const [department, setDepartment] = useState("");
  const { dept, role } = useAuth();

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(event.target.value);
  };

  const handleGetDepartmentAndWorkshopsList = async () => {
    if (role === "super-admin") {
      const departments = await getAllDepartmentList();
      setDeptList(departments || []);
    } else {
      setDepartment(dept);
    }

    const data = await getAllWorkshopListByDept(department || dept);
    if (data.message) {
      console.log(data);
      return;
    }
    setWorkshopList(data);
    setFilteredWorkshopList(data);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filteredList = workshopList.filter((workshop: any) =>
      workshop.name.toLowerCase().includes(term)
    );
    setFilteredWorkshopList(filteredList);
  };

  useEffect(() => {
    handleGetDepartmentAndWorkshopsList();
  }, [department]);

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

      <h1 className="text-xl text-text-950">
        Workshops conducted by:{" "}
        <span className="font-semibold">{department || dept}</span>
      </h1>

      {/* Search Bar */}
      <div className="relative w-full my-4">
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search workshops..."
          className="focus:ring-0 focus:outline-none w-full p-2 pl-10 border-2 rounded-lg focus:border-accent-400 "
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="flex justify-center flex-wrap gap-4 p-4">
        {filteredWorkshopList.length > 0 ? (
          filteredWorkshopList.map((workshop: any) => (
            <div
              className="h-72 w-72 border-2 flex flex-col justify-between items-center border-accent-400 rounded-lg hover:scale-95 transition-all duration-200 hover:border-accent-600 text-lg hover:cursor-pointer"
              onClick={() => {
                navigate(
                  `/dashboard/workshop-attendance/${workshop.workshopid}`
                );
              }}
              key={workshop.workshopid}
            >
              <img
                src={workshop.images}
                alt={workshop.name}
                className="h-full w-full rounded-t-md"
              />
              <p className="w-full bg-secondary-200 text-center rounded-b-md">
                {workshop.name}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-text-800">No workshops found.</p>
        )}
      </div>
    </div>
  );
};

export default WorkshopList;
