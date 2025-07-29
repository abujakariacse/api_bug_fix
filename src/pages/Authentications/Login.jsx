/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import GoogleLoginBtn from "../../Shared/GoogleLoginBtn";
import GithubLoginBtn from "../../Shared/GithubLoginBtn";
import toastMessage from "../../utils/toastMessage";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import CustomHelmet from "../../Shared/CustomHelmet";

const Login = () => {
  const { signInUser, setLocation, setLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setLocation(location.state);
  }, [location.state, setLocation]);

  // Login Functionalities
  const handleLogin = (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    signInUser(email, password)
      .then((res) => {
        const loggedInUser = res.user;
        const lastLoginUpdate = { lastLogin: new Date() };
        axiosSecure.patch(`/users/${loggedInUser.email}`, lastLoginUpdate).then(() => {
          setLoading(false);
          navigate(location.state ? location.state : "/");
          toastMessage("Logged in successfully!", "success");
        });
      })
      .catch((err) => {
        setLoading(false);
        err && toastMessage("Login failed. Please try again later.", "error");
      });
  };

  return (
    <section className="bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4 pt-24 pb-16">
      <CustomHelmet
        title="FitForge - Login"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      {/* Floating background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="fixed inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-lime-400 blur-3xl"></div>

        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-emerald-500 blur-3xl"></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 backdrop-blur-sm"
      >
        {/* Left Side - Branding */}
        <div className="bg-gradient-to-br from-lime-500 to-emerald-600 p-10 flex flex-col justify-center relative overflow-hidden">
          {/* Top left circle */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-18 -right-16 w-52 h-52 rounded-full bg-white/20"
          ></motion.div>

          {/* 3 circle top */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-4 right-8 md:right-32 lg:right-6 w-20 h-20 rounded-full bg-white/20"
          ></motion.div>

          {/* 3 circle left */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-15 right-8 md:right-32 lg:right-6 w-20 h-20 rounded-full bg-white/20"
          ></motion.div>

          {/* 3 circle bottom */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-10 right-16 md:right-40 lg:right-14 w-20 h-20 rounded-full bg-white/20"
          ></motion.div>

          {/* Bottom left Circle */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-white/20"
          ></motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Welcome Back!</h2>
            <p className="mb-8 text-gray-800 font-medium">
              Login to continue your FitForge journey and crush your goals
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="mb-4 text-sm text-black">
              Don't have an <span className="font-semibold text-white">account?</span>
            </p>

            <Link
              to="/register"
              className="group relative z-10 bg-black hover:bg-black/85 text-white text-center py-3 px-6 rounded-lg font-semibold flex justify-center items-center gap-2 w-[186px]"
            >
              <FaUserPlus className="text-white text-lg group-hover:scale-110 transition-transform duration-200" />
              Create Account
            </Link>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-gray-900/80 p-10 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <h3 className="text-3xl font-semibold mb-8 text-white">Login</h3>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block mb-2 text-sm font-medium text-gray-300">Email</label>
                <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus-within:border-lime-400 transition">
                  <FaEnvelope className="mr-3 text-lime-400" />
                  <input
                    value={"jakaria@mailinator.com"}
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    className="bg-transparent w-full focus:outline-none text-white placeholder-gray-500"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block mb-2 text-sm font-medium text-gray-300">Password</label>
                <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus-within:border-lime-400 transition">
                  <FaLock className="mr-3 text-lime-400" />
                  <input
                    value={"Asdf@1234"}
                    type="password"
                    placeholder="Your password"
                    name="password"
                    autoComplete="true"
                    className="bg-transparent w-full focus:outline-none text-white placeholder-gray-500"
                  />
                </div>
              </motion.div>

              {/* Forgot Password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-right"
              >
                <Link
                  onClick={() => {
                    toastMessage("under development", "info");
                  }}
                  className="text-sm text-lime-400 hover:text-lime-300 transition-colors"
                >
                  Forgot your password?
                </Link>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex items-center justify-center gap-3 w-full py-3.5 bg-gradient-to-r from-lime-500 to-emerald-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-lime-400/20 transition-all cursor-pointer"
              >
                <FaSignInAlt />
                Login
              </motion.button>
            </form>

            {/* Social Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="my-8 flex items-center"
            >
              <div className="flex-grow border-t border-gray-700" />
              <span className="px-4 text-sm text-gray-400">Or continue with</span>
              <div className="flex-grow border-t border-gray-700" />
            </motion.div>

            {/* Social Logins */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex gap-4"
            >
              <GoogleLoginBtn></GoogleLoginBtn>
              <GithubLoginBtn></GithubLoginBtn>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Login;
