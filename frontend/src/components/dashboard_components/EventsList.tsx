import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEventListByDept } from "../../services/EventsSVC";

const EventsList = ({targetPath, heading}: any) => {
  
  const navigate = useNavigate();
  const [eventList, setEventList] = useState<any>();

  const handleGetAllEventList = async () => {
    const data = await getAllEventListByDept("CSE-IT-AIDS");
    if (data.message) {
      console.log(data);
      return;
    }
    console.log(data);
    
    setEventList(data);
  };

  useEffect(() => {
    handleGetAllEventList();
  }, []);

  return (
    <div className="px-8 py-2 ">
      <h1 className="text-center text-xl">{heading}</h1>
      <h2 className="text-lg text-text-800">Events conducted by: <span className="font-semibold text-text-950">CSE-IT-AIDS</span></h2>
      <div className="flex justify-center flex-wrap gap-4 p-4 ">
        {eventList?.map((event: any) => {
          return (
            <div
              className="h-72 w-72 border-2 flex flex-col justify-between items-center border-accent-400 rounded-lg hover:scale-95 transition-all duration-200 hover:border-accent-600 text-lg hover:cursor-pointer"
              // onClick={() => {
              //   setEvent(event);
              // }}
              onClick={() => {
                navigate(`/dashboard/${targetPath}/${event.eventid}`);
              }}
              key={event.eventid}
            >
              <img src={event.images} alt={event.name} className="h-full w-full rounded-t-md"/>
              <p className="w-full bg-secondary-200 text-center rounded-b-md">
                {event.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventsList;
