import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login"; // Your Login component
import Dashboard from "./components/Dashboard"; // Your Dashboard component
import EventAttendance from "./components/dashboard_components/EventAttendance";
import EventWinners from "./components/dashboard_components/EventWinners";
import CollegeParticipants from "./components/dashboard_components/CollegeParticipants";
import WorkshopAttendance from "./components/dashboard_components/WorkshopAttendance";
import WorkshopList from "./components/dashboard_components/WorkshopList";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Navigate to="event-attendance" replace />} /> 
        <Route path="/dashboard/*" element={<Dashboard />}> 
          <Route path="event-attendance" element={<EventAttendance />} />
          <Route path="workshop-attendance" element={<WorkshopList />} />
          <Route path="workshop-attendance/:workshop-id" element={<WorkshopAttendance />} />
          <Route path="winners" element={<EventWinners />} />
          <Route path="participants" element={<CollegeParticipants />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;