/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useContext } from "react";
import { FaGithub } from "react-icons/fa";
import { AuthContext } from "../Provider/AuthProvider";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import toastMessage from "../utils/toastMessage";
import { useNavigate } from "react-router";

const GithubLoginBtn = () => {
  const { gitHubLogIn, location } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Github Login
  const handleGitHubLogin = async () => {
    try {
      const res = await gitHubLogIn();
      const { displayName, email, photoURL } = res.user;

      if (!email) return;

      navigate(`${location ? location : "/"}`);
      const user = {
        name: displayName,
        email,
        photoURL,
      };

      const response = await axiosSecure.post("/users/social", user);

      if (response.data.message === "User created") {
        toastMessage("🎉 Welcome! Your account has been created.", "success");
      } else if (
        response.data.message === "User already exists, login time updated"
      ) {
        toastMessage("👋 Welcome back! Logged in successfully.", "success");
      }
    } catch (error) {
      if (
        error.message ===
        "Firebase: Error (auth/account-exists-with-different-credential)."
      ) {
        return toastMessage(
          "Account exists with this email using another login option.",
          "error"
        );
      }
      toastMessage("❌ Github login failed. Please try again.", "error");
    }
  };

  return (
    <>
      <motion.button
        onClick={handleGitHubLogin}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-700 bg-gray-800 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
      >
        <FaGithub className="text-gray-200" />
        <span className="text-white">GitHub</span>
      </motion.button>
    </>
  );
};

export default GithubLoginBtn;
