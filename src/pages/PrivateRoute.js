import React, { useContext } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { UserContext } from "./../hooks/UserContext";
import Loading from "./../components/Loading";

export default function PrivateRoute(props) {
  const { user, isLoading } = useContext(UserContext);
  console.log(user, isLoading);

  const { component: Component, ...rest } = props;
  if (isLoading) {
    return <Loading />;
  }

  if (user) {
    if (props.role) {
      if (user.role == props.role || user.role=='admin') {
        return <Outlet />;
      } else {
        return <Navigate to="/home" />;
      }
    } else {
      return <Outlet />;
    }
  } else {
    return <Navigate to="/login" />;
  }
}
