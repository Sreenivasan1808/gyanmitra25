import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import EventAttendance from "./components/dashboard_components/EventAttendance";
import EventWinners from "./components/dashboard_components/EventWinners";
import CollegeParticipants from "./components/dashboard_components/CollegeParticipants";
// import WorkshopAttendance from "./components/dashboard_components/WorkshopAttendance";
// import WorkshopList from "./components/dashboard_components/WorkshopList";
import EventsList from "./components/dashboard_components/EventsList";
import ParticipantInformation from "./components/dashboard_components/ParticipantInformation";
import NotFound from "./components/NotFound";
import NotAuthorized from "./components/util_components/NotAuthorized";
import { RequireAuth } from "./services/RequireAuth";
import useAuth from "./services/useAuth";
import OnSpotRegistration from "./components/dashboard_components/OnSpotRegistration";
import PaymentUpdate from "./components/dashboard_components/PaymentUpdate";
import PaymentDetails from "./components/dashboard_components/PaymentDetails";
import KitReceived from "./components/dashboard_components/KitReceived";

const RoleBasedRedirect = () => {
  const { role } = useAuth();
  console.log("role");
  
  console.log(role);
  

  switch (role) {
    case "super-admin":
    case "event-coordinator":
      return <Navigate to="/dashboard/event-attendance" replace />;
    case "workshop-coordinator":
      return <Navigate to="/dashboard/workshop-attendance" replace />;
    case "certificate-committee":
      return <Navigate to="/dashboard/participants" replace />;
    case "registration-committee":
        return <Navigate to="/dashboard/on-spot-registration" replace />;
    case "domain-coordinator":
      return <Navigate to="/dashboard/event-attendance" replace />;
    case "registration-coordinator":
      return <Navigate to="/dashboard/on-spot-registration" replace />;
    default:
      return <Navigate to="/not-authorized" replace />;
  }
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        {/* Role-based redirect for /dashboard */}
        <Route
          path="/dashboard"
          element={
              <RoleBasedRedirect />
          }
        />
        {/* Protected dashboard routes */}
        <Route
          path="/dashboard/*"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        >
          <Route
            path="event-attendance"
            element={<EventsList targetPath="event-attendance" heading="Event Attendance" />}
          />
          <Route path="event-attendance/:event-id" element={<EventAttendance />} />
          {/* <Route path="workshop-attendance" element={<WorkshopList />} /> */}
          {/* <Route path="workshop-attendance/:workshop-id" element={<WorkshopAttendance />} /> */}
          <Route path="winners" element={<EventsList targetPath="winners" heading="Event Winners" />} />
          <Route path="winners/:event-id" element={<EventWinners />} />
          <Route path="participants" element={<CollegeParticipants />} />
          <Route path="participant-info" element={<ParticipantInformation />} />
          <Route path="kit-info" element={<KitReceived />} />
          <Route path="payment-update" element={<PaymentUpdate />} />
          <Route path="payment-details" element={<PaymentDetails />} />
          <Route path="on-spot-registration" element={<OnSpotRegistration />} />
        </Route>
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
