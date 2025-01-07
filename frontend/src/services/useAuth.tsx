import * as React from "react";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;

type AuthContextType = {
  authed: boolean;
  role: string;
  dept: string;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const authContext = React.createContext<AuthContextType | undefined>(undefined);

function useAuth() {
  const [authed, setAuthed] = React.useState(false);
  const [role, setRole] = React.useState("");
  const [dept, setDept] = React.useState("");

  return {
    authed,
    role,
    dept,
    login: async ({ username, password }: { username: string; password: string }) => {
      try {
        const response = await axios.post(`${SERVER_URL}/auth/login`, { username, password });
        if (response.status === 200) {
          setAuthed(true);
          setRole(response.data.role);
          setDept(response.data.dept);
          return { message: "Login successful", type: "success" };
        }
      } catch (error) {
        setAuthed(false);
        return { message: error?.response.data, type: "error" };
      }
    },
    logout: async () => {
      setRole("");
      setDept("");
      setAuthed(false);
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