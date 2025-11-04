import React from "react";
// import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PrivateLayout from "../Layout/PrivateLayout";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children }) {
  const {accessToken}=useSelector((state)=>state.auth)


  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <PrivateLayout children={children} />;
}
