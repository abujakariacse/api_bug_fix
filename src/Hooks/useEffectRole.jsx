import { useContext, useEffect, useState, useRef } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../Provider/AuthProvider";

const useEffectRole = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  const fetchUserRole = async () => {
    if (!user?.email || fetchedRef.current) return;

    fetchedRef.current = true;
    try {
      setRoleLoading(true);
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      setRole(res.data.role);
    } catch (err) {
      console.error("Failed to fetch user role:", err);
      setError(err);
    } finally {
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.email) {
      fetchUserRole();
    }
  }, [authLoading, user?.email]);

  return {
    role,
    roleLoading: authLoading || roleLoading,
    refetch: fetchUserRole,
    error,
  };
};

export default useEffectRole;
