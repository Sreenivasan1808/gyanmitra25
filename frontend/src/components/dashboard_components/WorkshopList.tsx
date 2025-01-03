import React from 'react'
import { useNavigate } from 'react-router-dom';

const WorkshopList = () => {
    const workshops = [
        {
          id: 0,
          name: "Python",
          imgSrc: "",
        },
        {
          id: 1,
          name: "Web development",
          imgSrc: "",
        },
        {
          id: 2,
          name: "Ml basics",
          imgSrc: "",
        },
        {
          id: 3,
          name: "Data Science",
          imgSrc: "",
        },
        {
          id: 4,
          name: "Quantum computing",
          imgSrc: "",
        },
        {
          id: 5,
          name: "Deep Learning",
          imgSrc: "",
        },
        {
          id: 6,
          name: "GPT",
          imgSrc: "",
        },
        {
          id: 7,
          name: "BERT, RAG",
          imgSrc: "",
        },
      ];
      const navigate = useNavigate();
  return (
    <div className="px-8 py-2 text-2xl">
      <div className="flex justify-center flex-wrap gap-4 p-4 ">
        {workshops.map((workshop) => {
          return (
            <div
              className="h-72 w-72 border-2 flex flex-col justify-between items-center border-accent-400 rounded-lg hover:scale-95 transition-all duration-200 hover:border-accent-600 text-xl hover:cursor-pointer"
              onClick={() => {
                navigate(`/dashboard/workshop-attendance/${workshop.id}`)
              }}
              key={workshop.id}
            >
              <img src={workshop.imgSrc} alt={workshop.name} />
              <p className="w-full bg-secondary-200 text-center rounded-b-md">
                {workshop.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default WorkshopList
