import React, { useContext } from "react";
import useUserRole from "../../Hooks/useUserRole";
import AdminDashboardHome from "./AdminDashboardHome";
import Loading from "../../Shared/Loading";
import MemberDashboardHome from "./MemberDashboardHome";
import TrainerDashboardHome from "./TrainerDashboardHome";
import { AuthContext } from "../../Provider/AuthProvider";

const DashboardHome = () => {
  const { loading } = useContext(AuthContext);
  const { role, roleLoading } = useUserRole();

  if (roleLoading || loading) {
    return <Loading></Loading>;
  }

  if (role === "admin") {
    return <AdminDashboardHome></AdminDashboardHome>;
  }
  if (role === "member") {
    return <MemberDashboardHome></MemberDashboardHome>;
  }
  if (role === "trainer") {
    return <TrainerDashboardHome></TrainerDashboardHome>;
  }
};

export default DashboardHome;
