import React from "react";

const EventsList = ({ setEvent }: any) => {
  const events = [
    {
      id: 0,
      name: "Debugging",
      imgSrc: "",
    },
    {
      id: 1,
      name: "Coding",
      imgSrc: "",
    },
    {
      id: 2,
      name: "Quiz",
      imgSrc: "",
    },
    {
      id: 3,
      name: "Paper presentation",
      imgSrc: "",
    },
    {
      id: 4,
      name: "Debugging",
      imgSrc: "",
    },
    {
      id: 5,
      name: "Coding",
      imgSrc: "",
    },
    {
      id: 6,
      name: "Quiz",
      imgSrc: "",
    },
    {
      id: 7,
      name: "Paper presentation",
      imgSrc: "",
    },
  ];
  return (
    <div className="px-8 py-2 text-2xl">
      <div className="flex justify-center flex-wrap gap-4 p-4 ">
        {events.map((event) => {
          return (
            <div
              className="h-72 w-72 border-2 flex flex-col justify-between items-center border-accent-400 rounded-lg hover:scale-95 transition-all duration-200 hover:border-accent-600 text-xl hover:cursor-pointer"
              onClick={() => {
                setEvent(event);
              }}
            >
              <img src={event.imgSrc} alt={event.name} />
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
