import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotAuthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
      <p className="text-lg mt-4">You do not have permission to view this page.</p>
      <p className="text-blue-500 mt-4 hover:cursor-pointer" onClick={() => navigate(-1)}>
        Go back
      </p>
    </div>
  );
};

export default NotAuthorized;