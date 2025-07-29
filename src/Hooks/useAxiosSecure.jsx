import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import toastMessage from "../utils/toastMessage";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const { user, logOut, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (!loading && token && user?.email) {
      config.headers.authorization = `Bearer ${token}`;
      config.headers.email = user?.email;
    }
    return config;
  });

  // response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        logOut();
        navigate("/login")
          .then(() => {
            localStorage.removeItem("token");
            toastMessage("Please sign in again", "error");
          })
          .catch((err) => {
            if (err) {
              toastMessage("Please contact Admin", "error");
            }
          });
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxiosSecure;
