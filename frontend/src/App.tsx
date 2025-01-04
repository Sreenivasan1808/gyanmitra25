import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login"; // Your Login component
import Dashboard from "./components/Dashboard"; // Your Dashboard component
import EventAttendance from "./components/dashboard_components/EventAttendance";
import EventWinners from "./components/dashboard_components/EventWinners";
import CollegeParticipants from "./components/dashboard_components/CollegeParticipants";
import WorkshopAttendance from "./components/dashboard_components/WorkshopAttendance";
import WorkshopList from "./components/dashboard_components/WorkshopList";
import EventsList from "./components/dashboard_components/EventsList";
import ParticipantInformation from "./components/dashboard_components/ParticipantInformation";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Navigate to="event-attendance" replace />} /> 
        <Route path="/dashboard/*" element={<Dashboard />}> 
          <Route path="event-attendance" element={<EventsList targetPath="event-attendance" heading="Event Attendance"/>} />
          <Route path="event-attendance/:event-id" element={<EventAttendance />} />
          <Route path="workshop-attendance" element={<WorkshopList />} />
          <Route path="workshop-attendance/:workshop-id" element={<WorkshopAttendance />} />
          <Route path="winners" element={<EventsList targetPath="winners" heading="Event Winners" />} />
          <Route path="winners/:event-id" element={<EventWinners />} />
          <Route path="participants" element={<CollegeParticipants />} />
          <Route path="participant-info" element={<ParticipantInformation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;