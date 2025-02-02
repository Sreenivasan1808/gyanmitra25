import * as React from "react";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

type AuthContextType = {
  authed: boolean;
  role: string;
  dept: string;
  login: (credentials: { username: string; password: string }) => Promise<{ message: string; type: string }>;
  logout: () => Promise<void>;
};

const authContext = React.createContext<AuthContextType | undefined>(undefined);

function useAuth() {
  
  const [authed, setAuthed] = React.useState(() => localStorage.getItem("authed") === "true");
  const [role, setRole] = React.useState(() => localStorage.getItem("role") || "");
  const [dept, setDept] = React.useState(() => localStorage.getItem("dept") || "");

  React.useEffect(() => {
    localStorage.setItem("authed", String(authed));
    localStorage.setItem("role", role);
    localStorage.setItem("dept", dept);
  }, [authed, role, dept]);

  return {
    authed,
    role,
    dept,
    login: async ({ username, password }: { username: string; password: string }) => {

      try {
        const response = await axios.post(`${SERVER_URL}/auth/login`, { username, password });
        if (response.status === 200) {
          const { role, dept } = response.data;

          // Update state and localStorage
          setAuthed(true);
          setRole(role);
          setDept(dept);
          localStorage.setItem("authed", "true");
          localStorage.setItem("role", role);
          localStorage.setItem("dept", dept);
          localStorage.removeItem("lastVisitedPage");


          return { message: "Login successful", type: "success" };
        }
      } catch (error: any) {
        setAuthed(false);
        return { message: error?.response?.data || "Login failed", type: "error" };
      }
      return { message: "Unexpected error", type: "error" };
    },
    logout: async () => {
      
      setAuthed(false);
      setRole("");
      setDept("");

      // Clear stored session
      localStorage.removeItem("authed");
      localStorage.removeItem("role");
      localStorage.removeItem("dept");
      localStorage.removeItem("lastVisitedPage"); // Remove last visited page

    },
  };
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
  const context = React.useContext(authContext);
  if (!context) {
    throw new Error("AuthConsumer must be used within an AuthProvider");
  }
  return context;
}
