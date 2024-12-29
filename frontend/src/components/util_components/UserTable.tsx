import React from 'react';

const UserTable = ({ users }) => {
  return (
    <div className="p-4 md:p-8">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">GMID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Participated Events</th>
          </tr>
        </thead>
        <tbody>
          {users.map((userObj: any, index: any) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{userObj.user.user_id}</td>
              <td className="border border-gray-300 p-2">{userObj.user.name}</td>
              {/* <td className="border border-gray-300 p-2">{userObj.user.email}</td>
              <td className="border border-gray-300 p-2">{userObj.user.phone}</td> */}
              <td className="border border-gray-300 p-2">
                <ul>
                  {userObj.events.map((event: any, eventIndex: any) => (
                    <li key={eventIndex}>
                      {/* Event ID: {event.event_id}, Status: {event.status ? 'Active' : 'Inactive'} */}
                      {event.name}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;