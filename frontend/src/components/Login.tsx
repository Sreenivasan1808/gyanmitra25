import { useState } from "react";
import useAuth from "../services/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import Snackbar from "./util_components/Snackbar";

const Login = () => {
  const [credentials, setCredentials] = useState<any>({});

  const navigate = useNavigate();
  const { authed, login } = useAuth();
  const { state } = useLocation();
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    type: "info", // Default type
  });

  const showSnackbar = (message: string, type: string) => {
    setSnackbar({ isOpen: true, message, type });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const authResponse = await login({ ...credentials });
    if (authResponse.type == "success") {
      navigate(state?.path || "/dashboard");
    
      }else
      showSnackbar(
        authResponse?.message || "An error occurred",
        authResponse?.type || "error"
      );
  };
  return (
    <div className="h-screen md:flex">
      <div className="relative overflow-hidden md:flex w-[60%] bg-gradient-to-tr from-primary-600 to-secondary-700 i justify-around items-center hidden">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans m-0 p-0">
            Mepco Schlenk Engineering College
          </h1>
          <p className="text-gray-200 text-xl m-0 p-0">Sivakasi</p>
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 border-accent-200"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 border-accent-200"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 border-accent-200"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 border-accent-200"></div>
      </div>

      <div className="flex flex-col h-screen md:w-[40%] justify-center py-10 items-center gap-5 bg-background-700 md:bg-white">
        <div className="">
          <h1 className="text-text-50 font-bold text-3xl font-sans m-0 p-0 text-center md:text-text-950">
            GyanMitra '25
          </h1>
          <p className="text-text-200 text-xl m-0 p-0 text-center  md:text-text-800">
            A National level technical symposium
          </p>
        </div>
        <form className="bg-white border-2 rounded-md border-accent-400 p-8">
          <h1 className="text-gray-800 font-bold text-2xl mb-2 text-center">
            Login
          </h1>
          {/* <p className="text-sm font-normal text-gray-600 mb-7">Welcome Back</p> */}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4 gap-2 focus-within:border-secondary-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              className="pl-2 outline-none border-none focus:outline-none focus:ring-0"
              type="text"
              name="username"
              id="username"
              autoFocus
              placeholder="Username"
              value={credentials.username}
              onChange={(e) =>
                setCredentials((prev: any) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex items-center border-2 py-2 px-3 rounded-2xl gap-2 focus-within:border-secondary-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              className="pl-2 outline-none border-none focus:outline-none focus:ring-0"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials((prev: any) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </div>

          <button
            type="submit"
            className="block w-full bg-primary-500 mt-4 py-2 rounded-2xl text-white font-semibold mb-2 hover:bg-primary-600"
            onClick={handleLogin}
          >
            Login
          </button>

          <p></p>
        </form>
      </div>
      <Snackbar
        message={snackbar.message}
        isOpen={snackbar.isOpen}
        type={snackbar.type}
        onClose={closeSnackbar}
      />
    </div>
  );
};

export default Login;
