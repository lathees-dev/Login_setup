import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo || !userInfo.is_admin) {
      localStorage.removeItem("userInfo"); // Clear invalid data
      return <Navigate to="/login" />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem("userInfo"); // Clear invalid data
    return <Navigate to="/login" />;
  }
};

export default ProtectedAdminRoute;
