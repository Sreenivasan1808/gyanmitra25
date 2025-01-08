import { useEffect, useState } from "react";
import {
  getAllCollegeList,
  getAllParticipantsCollegeWise,
} from "../../services/ParticipantSVC";
import UserTable from "../util_components/UserTable";

const CollegeParticipants = () => {
  const [collegeList, setCollegeList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [participantsList, setParticicpantsList] = useState();

  const getCollegeList = async () => {
    const college = await getAllCollegeList();
    setCollegeList(college);
  };

  useEffect(() => {
    getCollegeList();
  }, []);

  const handleInputChange = (e:any) => {
    const value = e.target.value;
    setInputValue(value);
    setFilteredColleges(
      collegeList.filter((college:string) =>
        college.toLowerCase().includes(value.toLowerCase())
      )
    );
    setShowDropdown(value.length > 0 && filteredColleges.length > 0);
  };

  const handleOptionClick = async (item: any) => {
    setInputValue(item);
    setShowDropdown(false); // Hide dropdown after selection
    const participants = await getAllParticipantsCollegeWise(item);
    console.log(participants);
    setParticicpantsList(participants);
  };

  return (
    <div className="p-4 md:p-8 relative h-full">
      <h1 className="p-8 text-2xl">Participants List</h1>
      <form
        action=""
        className="p-4 border-2 border-accent-400 rounded-lg flex justify-center"
      >
        <div className="flex flex-col gap-2 items-center">
          <label htmlFor="college" className="text-text-900 text-lg">
            College name
          </label>
          <div className="relative w-full md:w-72">
            <input
              id="college"
              name="college"
              value={inputValue}
              onChange={handleInputChange}
              autoComplete="off"
              className="p-2 rounded-lg bg-white w-72"
            />
            {showDropdown && (
              <ul className="absolute bg-white border border-gray-300 rounded-lg mt-1 z-10 w-full max-h-52 overflow-y-scroll">
                {filteredColleges.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-2 hover:bg-gray-200 cursor-pointer list-item list-disc"
                    onClick={() => handleOptionClick(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </form>
      {participantsList && (
        <>
          <h1 className="text-xl mt-4 px-8 py-2">
            Participants from{" "}
            <span className="font-semibold text-text-900">{inputValue}</span>
          </h1>
          <UserTable users={participantsList} />
        </>
      )}
    </div>
  );
};

export default CollegeParticipants;
