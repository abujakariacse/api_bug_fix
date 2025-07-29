import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import Loading from "../Shared/Loading";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  const { pathname } = useLocation();

  if (loading) {
    return <Loading></Loading>;
  }

  if (!user) {
    return <Navigate state={pathname} to={"/login"}></Navigate>;
  }
  return children;
};

export default PrivateRoute;
