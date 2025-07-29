// import axios from "axios";
// import { useContext } from "react";
// import { useNavigate } from "react-router";
// import { AuthContext } from "../Provider/AuthProvider";
// import toastMessage from "../utils/toastMessage";

// // baseURL: "https://assignment-12-server-delta-sepia.vercel.app",
// const axiosInstance = axios.create({
//   baseURL: "https://assignment-12-server-delta-sepia.vercel.app",
// });

// const useAxiosSecure = () => {
//   const { user, logOut, loading } = useContext(AuthContext);
//   const navigate = useNavigate();
//   axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");

//     if (!loading && token && user?.email) {
//       config.headers.authorization = `Bearer ${token}`;
//       config.headers.email = user?.email;
//     }
//     return config;
//   });

//   // response interceptor
//   axiosInstance.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     (error) => {
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         logOut();
//         navigate("/login")
//           .then(() => {
//             localStorage.removeItem("token");
//             toastMessage("Please sign in again", "error");
//           })
//           .catch((err) => {
//             if (err) {
//               toastMessage("Please contact Admin", "error");
//             }
//           });
//       }

//       return Promise.reject(error);
//     }
//   );

//   return axiosInstance;
// };

// export default useAxiosSecure;

import axios from "axios";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import toastMessage from "../utils/toastMessage";
import { useNavigate } from "react-router";

const axiosInstance = axios.create({
  baseURL: "https://assignment-12-server-delta-sepia.vercel.app", // or use import.meta.env.VITE_API_URL
});

const useAxiosSecure = () => {
  const { user, logOut, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      const requestInterceptor = axiosInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.authorization = `Bearer ${token}`;
          config.headers.email = user.email;
        }
        return config;
      });

      const responseInterceptor = axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error?.response?.status === 401 || error?.response?.status === 403) {
            logOut()
              .then(() => {
                localStorage.removeItem("token");
                toastMessage("Please sign in again", "error");
                navigate("/login");
              })
              .catch(() => {
                toastMessage("Please contact Admin", "error");
              });
          }
          return Promise.reject(error);
        }
      );

      // Cleanup interceptors on unmount or re-run
      return () => {
        axiosInstance.interceptors.request.eject(requestInterceptor);
        axiosInstance.interceptors.response.eject(responseInterceptor);
      };
    }
  }, [user, loading, logOut, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;
