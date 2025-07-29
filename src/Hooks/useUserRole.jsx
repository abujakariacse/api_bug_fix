import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const {
    data: role,
    isLoading,
    isFetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data.role;
    },
  });

  return {
    role,
    roleLoading: authLoading || isLoading || isFetching,
    isError,
    error,
    refetch,
  };
};

export default useUserRole;
