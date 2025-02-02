import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";

export const rolePermissions: any = {
  "super-admin": ["/dashboard/*"],
  "event-coordinator": [
    "/dashboard/event-attendance",
    "/dashboard/event-attendance/*",
    "/dashboard/winners",
    "/dashboard/winners/*",
    "/dashboard/participant-info",
  ],
  "workshop-coordinator": [
    "/dashboard/workshop-attendance",
    "/dashboard/workshop-attendance/*",
    "/dashboard/participant-info",
  ],
  "certificate-committee": [
    "/dashboard/participant-info",
    "/dashboard/participants",
  ],
  "registration-committee": [
    "/dashboard/on-spot-registration",
  ],
  "registration-coordinator": [

  ],
  "domain-coordinator": [
    "/dashboard/event-attendance",
    "/dashboard/event-attendance/*",
    "/dashboard/winners",
    "/dashboard/winners/*",
    "/dashboard/participant-info",
    "/dashboard/workshop-attendance",
    "/dashboard/workshop-attendance/*",
  ]
};

export function RequireAuth({ children }: any) {
  const { authed, role } = useAuth();
  const location = useLocation();

  if (!authed) {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }

  const allowedRoutes = rolePermissions[role] || [];

  // Save last visited page in localStorage
  localStorage.setItem("lastVisitedPage", location.pathname);

  // Check if the current path matches any allowed routes
  const isAuthorized = allowedRoutes.some((route: any) =>
    location.pathname.startsWith(route.replace("*", ""))
  );

  if (!isAuthorized && role !== "super-admin") {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}