import { Navigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import Loading from "../Shared/Loading";

const AdminTrainerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <Loading></Loading>;
  }
  if (!user || (role !== "admin" && role !== "trainer") || role === "member") {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    );
  }

  return children;
};

export default AdminTrainerRoute;
