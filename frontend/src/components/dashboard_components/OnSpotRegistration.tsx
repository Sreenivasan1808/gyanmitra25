import { useState } from "react";
import Accordian, { AccordianItem } from "../util_components/Accordian";
import {
  approveRegistrationRequests,
  rejectRegistrationRequests,
  retrieveRegistrationFormResponses,
} from "../../services/RegistrationSVC";
import Snackbar from "../util_components/Snackbar";
import Modal from "../util_components/Modal";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";

interface Student {
  Name: string;
  Email: string;
  gender: string;
  CollegeName: string;
  MobileNo: string;
  CollegeCity: string;
}

interface GroupedCollege {
  collegeName: string;
  participantList: Student[];
}

const OnSpotRegistration = () => {
  const [formResponses, setFormResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    type: "info", // Default type
  });
  const [approvedParticipantsList, setApprovedParticipantsList] = useState<any>(
    []
  );

  const showSnackbar = (message: string, type: string) => {
    setSnackbar({ isOpen: true, message, type });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  };

  const processResponse = (responses: any[]): GroupedCollege[] => {
    const groupedByCollege = responses.reduce(
      (acc: Record<string, Student[]>, student: any) => {
        const collegeName = student["CollegeName"];
        const simplifiedStudent: Student = {
          Name: student.Name,
          Email: student.Email,
          gender: student.gender,
          CollegeName: collegeName,
          MobileNo: student["MobileNo"],
          CollegeCity: student["CollegeCity"],
        };

        if (!acc[collegeName]) {
          acc[collegeName] = [];
        }

        acc[collegeName].push(simplifiedStudent);
        return acc;
      },
      {}
    );

    return Object.entries(groupedByCollege).map(
      ([collegeName, participantList]) => ({
        collegeName,
        participantList,
      })
    );
  };

  const handleFetchFormResponses = async () => {
    // e.preventDefault();
    setLoading(true); // Set loading to true
    try {
      const responses = await retrieveRegistrationFormResponses();
      console.log(responses);
      if (responses === null) {
        console.log("No responses found");
        showSnackbar("No requests available", "info");
        setFormResponses([]);
      } else {
        const processedResponse = processResponse(responses);
        console.log("Processed response", processedResponse);
        setFormResponses(processedResponse);
      }
    } catch (error) {
      console.error("Error fetching form responses:", error);
      showSnackbar("Failed to fetch registration requests", "error");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleApprove = async (
    selectedParticipant: any,
    approvalFor: number
  ) => {
    console.log("approve: ", selectedParticipant);
    const status = await approveRegistrationRequests(
      selectedParticipant,
      approvalFor
    );
    setApprovedParticipantsList(status.participants);
    showSnackbar(status.message, status.type);
    handleFetchFormResponses();
  };

  const handleReject = async (selectedParticipant: any) => {
    console.log("reject: ", selectedParticipant);
    const status = await rejectRegistrationRequests(selectedParticipant);
    showSnackbar(status.message, status.type);
    handleFetchFormResponses();
  };

  return (
    <div className="px-8 py-2 flex flex-col justify-center items-center w-full gap-4">
      <div className="p-4 border-2 border-accent-300 rounded-lg w-full mt-2">
        <h2 className="text-lg font-semibold">Instructions</h2>
        <ul className="list-disc px-2">
          <li>Ask the participant to fill the Google form</li>
          <li>
            Any changes to information before approval of the participant can be
            changed within the Google form. Inform the same to the participant
          </li>
          <li>
            Press the button{" "}
            <span className="font-semibold">Fetch Registration Requests</span>
          </li>
          <li>It retrieves all the responses of the Google Form</li>
          <li>Receive payment from participants before approving them</li>
          <li>
            Use the checkboxes to select participants and click approve or
            reject
          </li>
        </ul>
      </div>
      <div className="w-full flex justify-end">
        <button
          className="px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-all duration-100 ease-in-out transform active:scale-90"
          onClick={(e) => {
            e.preventDefault();
            handleFetchFormResponses();
          }}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Fetching..." : "Fetch Registration Requests"}
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center w-full py-8">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-secondary-500"></div>
        </div>
      ) : (
        <>
          <h1 className="text-xl">Registration Requests</h1>
          <Accordian className="w-full">
            {formResponses.map((college, index) => (
              <AccordianItem
                key={index}
                value={college.collegeName}
                trigger={college.collegeName}
              >
                <ParticipantsTable
                  participants={college.participantList}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </AccordianItem>
            ))}
          </Accordian>
        </>
      )}

      <table className="w-full text-base rtl:text-right m-2 text-center overflow-x-scroll">
        <thead className=" text-text-900 uppercase bg-secondary-500">
          <tr>
            <th scope="col" className="px-6 py-3">
              S.No
            </th>
            <th scope="col" className="px-6 py-3 w-fit">
              GMID
            </th>
            <th scope="col" className="px-6 py-3 w-full">
              Full Name
            </th>
            <th scope="col" className="px-6 py-3 w-full">
              College
            </th>
            <th scope="col" className="px-6 py-3 w-full">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          {approvedParticipantsList &&
            approvedParticipantsList.map((participant: any, idx: number) => {
              return (
                <tr className="bg-white border-b" key={idx}>
                  <td className="px-4 py-4 w-fit">{idx + 1}</td>
                  <td
                    scope="row"
                    className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                  >
                    {participant.user_id}
                  </td>
                  <td
                    scope="row"
                    className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                  >
                    {participant.name}
                  </td>
                  <td
                    scope="row"
                    className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-fit text-center"
                  >
                    {participant.cname}
                  </td>
                  <td
                    scope="row"
                    className="px-4 py-4 font-medium text-text-900 whitespace-nowrap w-full text-center flex justify-center"
                  >
                    {participant.email}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <Snackbar
        message={snackbar.message}
        isOpen={snackbar.isOpen}
        type={snackbar.type}
        onClose={closeSnackbar}
      />
    </div>
  );
};

const ParticipantsTable = ({ participants, onApprove, onReject }: any) => {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);

  const columns = [
    {
      Header: "Name",
      accessor: "Name",
    },
    {
      Header: "Email",
      accessor: "Email",
    },
    {
      Header: "Phone",
      accessor: "MobileNo",
    },
  ];

  const data = participants;



  const handleRowSelect = (email: string, checked: boolean) => {
    setSelectedParticipants((_prev:any) => (checked ? [email] : []));
  };
  


  return (
    <div className="w-full">
      <table className="table-auto border-collapse border border-gray-200 w-full">
        <thead>
          <tr>
            {/* <th className="border border-gray-200 px-4 py-2">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th> */}
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="border border-gray-200 px-4 py-2"
              >
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any) => (
            <tr key={row.Email}>
              <td className="border border-gray-200 px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedParticipants.includes(row.Email)}
                  onChange={(e: any) => handleRowSelect(row.Email, e.target.checked)} // Remove the checked param
                />
              </td>
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  className="border border-gray-200 px-4 py-2"
                >
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          className="px-4 py-2 bg-primary-500 text-white rounded-lg enabled:hover:bg-primary-600 disabled:hover:cursor-not-allowed"
          disabled={selectedParticipants.length == 0}
          onClick={() => setApproveModalOpen(true)}
        >
          Approve
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-red-500 text-white rounded-lg enabled:hover:bg-red-600 disabled:hover:cursor-not-allowed"
          disabled={selectedParticipants.length == 0}
          onClick={() => setRejectModalOpen(true)}
        >
          Reject
        </button>
      </div>

      {/* Reject Modal */}
      <Modal open={rejectModalOpen} onClose={() => setRejectModalOpen(false)}>
        <div className="text-center w-56">
          <XMarkIcon className="size-32 mx-auto text-red-500" />
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black text-gray-800">Confirm Reject</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to reject these participants?
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-red-600 rounded-lg w-full text-white"
              onClick={async () => {
                await onReject(selectedParticipants);
                setRejectModalOpen(false);
              }}
            >
              Reject
            </button>
            <button
              className="px-4 py-2 bg-accent-100 rounded-lg w-full"
              onClick={() => setRejectModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Approval Modal */}
      <Modal open={approveModalOpen} onClose={() => setApproveModalOpen(false)}>
        {
          // Ensure we have a selected participant before displaying details
          selectedParticipants.length > 0 &&
            (() => {
              const selectedParticipant = participants.find(
                (p: any) => p.Email === selectedParticipants[0]
              );

              return (
                <div className="text-center min-w-56">
                  <CheckIcon className="size-32 mx-auto text-green-500" />
                  <div className="mx-auto my-4 w-48">
                    <h3 className="text-lg font-black text-gray-800">
                      Confirm Approval
                    </h3>
                    <p className="text text-gray-500">
                      Are you sure you want to approve this participant?
                      <span className="font-semibold">NOTE: </span> Make sure the participant has paid the entry fee and has received the kit
                      <ul>
                        <li>
                          <strong>Name:</strong> {selectedParticipant?.Name}
                        </li>
                        <li>
                          <strong>College:</strong>{" "}
                          {selectedParticipant?.CollegeName}
                        </li>
                        <li>
                          <strong>Email:</strong> {selectedParticipant?.Email}
                        </li>
                      </ul>
                    </p>
                  </div>
                  <div className="flex gap-4">
                    {/* <button
                      className="px-4 py-2 bg-green-500 rounded-lg w-full hover:bg-green-600 text-white"
                      onClick={async () => {
                        await onApprove(selectedParticipants, 0);
                        setApproveModalOpen(false);
                      }}
                    >
                      Approve for Workshops alone
                    </button> */}
                    <button
                      className="px-4 py-2 bg-green-500 rounded-lg w-full hover:bg-green-600 text-white"
                      onClick={async () => {
                        await onApprove(selectedParticipants, 1);
                        setApproveModalOpen(false);
                      }}
                    >
                      Approve for Events
                    </button>
                    {/* <button
                      className="px-4 py-2 bg-green-500 rounded-lg w-full hover:bg-green-600 text-white"
                      onClick={async () => {
                        await onApprove(selectedParticipants, 2);
                        setApproveModalOpen(false);
                      }}
                    >
                      Approve for both
                    </button> */}
                    <button
                      className="px-4 py-2 bg-accent-100 rounded-lg w-full"
                      onClick={() => setApproveModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })()
        }
      </Modal>
    </div>
  );
};

export default OnSpotRegistration;
