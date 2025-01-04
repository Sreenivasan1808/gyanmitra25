import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllWorkshopListByDept } from "../../services/EventsSVC";

const WorkshopList = () => {
  
  const navigate = useNavigate();
  const [workshopList, setWorkshopList] = useState<any>();

  const handleGetAllWorkshopList = async () => {
    const data = await getAllWorkshopListByDept("CSE-IT-AIDS");
    if (data.message) {
      console.log(data);
      return;
    }
    setWorkshopList(data);
  };

  useEffect(() => {
    handleGetAllWorkshopList();
  }, []);

  return (
    <div className="px-8 py-2">
      <h1 className="text-xl text-text-950">Events conducted by: <span className="font-semibold">CSE-IT-AIDS</span></h1>
      <div className="flex justify-center flex-wrap gap-4 p-4 ">
        {workshopList?.map((workshop: any) => {
          return (
            <div
              className="h-72 w-72 border-2 flex flex-col justify-between items-center border-accent-400 rounded-lg hover:scale-95 transition-all duration-200 hover:border-accent-600 text-lg hover:cursor-pointer"
              onClick={() => {
                navigate(`/dashboard/workshop-attendance/${workshop.workshopid}`);
              }}
              key={workshop.workshopid}
            >
              <img src={workshop.images} alt={workshop.name} className="h-full w-full rounded-t-md" />
              <p className="w-full bg-secondary-200 text-center rounded-b-md">
                {workshop.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkshopList;
