import { useState } from "react";
import { getParticipantDetailsFromGMID } from "../../services/ParticipantSVC";

const ParticipantInformation = () => {
  const [gmid, setGmid] = useState<string>("");
  const [participant, setParticipant] = useState<any>({});

  const handleGetParticipantDetails = async (e: any) => {
    e.preventDefault();
    const details = await getParticipantDetailsFromGMID(gmid);
    setParticipant(details);
  };
  return (
    <div className="py-2 px-8 flex flex-col justify-center items-center gap-4">
      <h2 className="text-xl text-center">Participant Information</h2>
      <div className="border-2 border-secondary-500 p-4 rounded-lg m-2 w-72 flex flex-col items-center gap-4">
        <div className="flex flex-col gap-1 max-w-72">
          <label htmlFor="gmid">GMID</label>
          <input
            type="text"
            id="gmid"
            name="gmid"
            className="border-2 rounded-lg outline-none focus:ring-0 focus:border-accent-500 p-2"
            autoFocus
            value={gmid}
            onChange={(e) => {setGmid(e.target.value)}}
          />
        </div>
        <button
          className="rounded-lg px-4 py-2 text-white text-center bg-green-600 hover:bg-green-700 hover:scale-95"
          onClick={handleGetParticipantDetails}
        >
          Get Details
        </button>
      </div>

      <div className="border-2 border-secondary-500 p-4 rounded-lg m-2 w-full flex flex-col items-center justify-center">
        <table className="table w-full">
            <tbody>
                <tr className="table-row border-2 border-gray-300 text-center">
                    <td className="font-semibold">GMID</td>
                    <td>{participant.user_id}</td>
                </tr>
                <tr className="table-row border-2 border-gray-300 text-center">
                    <td className="font-semibold">Full name</td>
                    <td>{participant.name}</td>
                </tr>
                <tr className="table-row border-2 border-gray-300 text-center">
                    <td className="font-semibold">Gender</td>
                    <td>{participant.gender}</td>
                </tr>
                <tr className="table-row border-2 border-gray-300 text-center">
                    <td className="font-semibold">College</td>
                    <td>{participant.cname +", " + participant.ccity}</td>
                </tr>
                <tr className="table-row border-2 border-gray-300 text-center">
                    <td className="font-semibold">Email</td>
                    <td>{participant.email}</td>
                </tr>
                <tr className="table-row border-2 border-gray-300 text-center">
                    <td className="font-semibold">Phone</td>
                    <td>{participant.phone}</td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticipantInformation;
