import React from "react";
import { Link } from "react-router-dom";

const NotAuthorized = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
      <p className="text-lg mt-4">You do not have permission to view this page.</p>
      <Link to="/" className="text-blue-500 mt-4">
        Go to Home
      </Link>
    </div>
  );
};

export default NotAuthorized;