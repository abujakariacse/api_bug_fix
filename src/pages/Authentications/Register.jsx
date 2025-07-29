/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaCamera,
  FaUserPlus,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Provider/AuthProvider";
import { useContext } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import GoogleLoginBtn from "../../Shared/GoogleLoginBtn";
import GithubLoginBtn from "../../Shared/GithubLoginBtn";
import toastMessage from "../../utils/toastMessage";
import CustomHelmet from "../../Shared/CustomHelmet";

const Register = () => {
  const { createUser, updateUser, location, setUser } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleRegister = (data) => {
    const { name, email, password, photo } = data;
    const imageFile = photo[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("imageFile", imageFile);

    // Create user in Firebase
    createUser(email, password)
      .then(async (result) => {
        const user = result.user;

        if (user) {
          navigate(`${location ? location : "/"}`);
          toastMessage(
            "Account created successfully! Welcome aboard 🎉",
            "success"
          );
          try {
            const res = await axiosSecure.post("/users", formData);
            if (res.data) {
              updateUser({
                ...user,
                displayName: name,
                photoURL: res.data.finalImageUrl,
              }).then(() => {
                setUser({
                  ...user,
                  displayName: name,
                  photoURL: res.data.finalImageUrl,
                });
              });
            }
          } catch (err) {
            toastMessage(
              "Registration failed. Please verify your information and try again!",
              "error"
            );
          }
        }
      })
      .catch((error) => {
        error &&
          toastMessage(
            "Registration failed. Please verify your information and try again!",
            "error"
          );
      });
  };

  const selectedPhoto = watch("photo");

  return (
    <section className="bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4 pt-24 pb-16">
      <CustomHelmet
        title="FitForge - Register"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      {/* Background Blur Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="fixed inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-lime-400 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-emerald-500 blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 backdrop-blur-sm"
      >
        {/* Left Side */}
        <div className="bg-gradient-to-br from-lime-500 to-emerald-600 p-10 flex flex-col justify-center relative overflow-hidden">
          {/* Circles */}
          {[
            "-top-18 -right-16",
            "bottom-4 right-8 md:right-32 lg:right-6",
            "bottom-15 right-8 md:right-32 lg:right-6",
            "bottom-10 right-16 md:right-40 lg:right-14",
            "-bottom-16 -left-16",
          ].map((pos, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className={`absolute ${pos} w-20 h-20 lg:w-52 lg:h-52 rounded-full bg-white/20`}
            />
          ))}

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Join FitForge!
            </h2>
            <p className="mb-8 text-gray-800 font-medium">
              Create your account and start your fitness journey
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="mb-4 text-sm text-black">
              Already have an{" "}
              <span className="font-semibold text-white">account?</span>
            </p>
            <Link
              to="/login"
              className="group relative z-10 bg-black hover:bg-black/85 text-white text-center py-3 px-6 rounded-lg font-semibold flex justify-center items-center gap-2 w-[186px]"
            >
              <FaUserPlus className="text-white text-lg group-hover:scale-110 transition-transform duration-200" />
              Login Now
            </Link>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-gray-900/80 p-10 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-3xl font-semibold mb-8 text-white">
              Create Account
            </h3>

            <form className="space-y-6" onSubmit={handleSubmit(handleRegister)}>
              {/* Name */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus-within:border-lime-400 transition">
                  <FaUser className="mr-3 text-lime-400" />
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Your full name"
                    className="bg-transparent w-full text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus-within:border-lime-400 transition">
                  <FaEnvelope className="mr-3 text-lime-400" />
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="Your email address"
                    className="bg-transparent w-full text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Profile Photo */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Profile Photo
                </label>
                <label
                  htmlFor="photo"
                  className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 cursor-pointer hover:border-lime-400 transition"
                >
                  <FaCamera className="mr-3 text-lime-400" />
                  <span className="text-white truncate">
                    {selectedPhoto?.[0]?.name || "Upload your photo"}
                  </span>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("photo", {
                      required: "Photo is required",
                    })}
                  />
                </label>
                {errors.photo && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.photo.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus-within:border-lime-400 transition">
                  <FaLock className="mr-3 text-lime-400" />
                  <input
                    type="password"
                    autoComplete="true"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                      validate: {
                        hasUppercase: (value) =>
                          /[A-Z]/.test(value) ||
                          "Must include at least one uppercase letter",
                        hasLowercase: (value) =>
                          /[a-z]/.test(value) ||
                          "Must include at least one lowercase letter",
                        hasNumber: (value) =>
                          /\d/.test(value) ||
                          "Must include at least one number",
                        hasSpecialChar: (value) =>
                          /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) ||
                          "Must include at least one special character",
                      },
                    })}
                    placeholder="Create a password"
                    className="bg-transparent w-full text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>

                {/* Error Messages */}
                {errors.password?.types?.hasUppercase && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.password.types.hasUppercase}
                  </p>
                )}
                {errors.password?.types?.hasLowercase && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.password.types.hasLowercase}
                  </p>
                )}
                {errors.password?.types?.hasSpecialChar && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.password.types.hasSpecialChar}
                  </p>
                )}
                {errors.password?.types?.hasNumber && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.password.types.hasNumber}
                  </p>
                )}
                {errors.password?.message && !errors.password?.types && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex items-center justify-center gap-3 w-full py-3.5 bg-gradient-to-r from-lime-500 to-emerald-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-lime-400/20 transition-all cursor-pointer"
              >
                <FaUserPlus />
                Create Account
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-grow border-t border-gray-700" />
              <span className="px-4 text-sm text-gray-400">
                Or sign up with
              </span>
              <div className="flex-grow border-t border-gray-700" />
            </div>

            {/* Social Logins */}
            <div className="flex gap-4">
              <GoogleLoginBtn></GoogleLoginBtn>
              <GithubLoginBtn></GithubLoginBtn>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Register;
