import { Navigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import Loading from "../Shared/Loading";

const TrainerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <Loading></Loading>;
  }

  if (!user || role !== "trainer") {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    );
  }

  return children;
};

export default TrainerRoute;
