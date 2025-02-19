
const UserTable = ({ users }: any) => {
  console.log(users);
  
  return (
    <div className="p-4 md:p-8">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">S.No</th>
            <th className="border border-gray-300 p-2">GMID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Participated Events</th>
            {/* <th className="border border-gray-300 p-2">Participated Workshops</th> */}
            <th className="border border-gray-300 p-2">Year and Department</th>
            <th className="border border-gray-300 p-2">Mobile No.</th>
          </tr>
        </thead>
        <tbody>
          {users.map((userObj: any, index: any) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{index+1}</td>
              <td className="border border-gray-300 p-2">{userObj.user.user_id}</td>
              <td className="border border-gray-300 p-2">{userObj.user.name}</td>
              {/* <td className="border border-gray-300 p-2">{userObj.user.email}</td>
              <td className="border border-gray-300 p-2">{userObj.user.phone}</td> */}
              <td className="border border-gray-300 p-2">
                <ul className='ml-4 list-disc'>
                  {userObj?.events.map((event: any, eventIndex: any) => (
                    <li key={eventIndex}>
                      {/* Event ID: {event.event_id}, Status: {event.status ? 'Active' : 'Inactive'} */}
                      {event.name}
                    </li>
                  ))}
                </ul>
              </td>
              {/* <td className="border border-gray-300 p-2">
                <ul className='ml-4 list-disc'>
                  {userObj?.workshops.map((workshop: any, workshopIndex: any) => (
                    <li key={workshopIndex}>
                      Event ID: {event.event_id}, Status: {event.status ? 'Active' : 'Inactive'}
                      {workshop.name}
                    </li>
                  ))}
                </ul>
              </td> */}
              <td className="border border-gray-300 p-2">{userObj.user.ccity}</td>
              <td className="border border-gray-300 p-2">{userObj.user.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;