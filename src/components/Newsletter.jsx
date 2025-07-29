/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaEnvelope, FaUser, FaPaperPlane } from "react-icons/fa";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import toastMessage from "../utils/toastMessage";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";

const Newsletter = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const handleNewsLetter = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const userData = { name, email };

    if (!name) {
      toastMessage("Please provide name", "warning");
      return;
    } else if (!email) {
      toastMessage("Please provide email", "warning");
      return;
    }

    axiosSecure
      .post("/newsletter", userData)
      .then((res) => {
        if (res.data.insertedId) {
          toastMessage("Thanks for subscribing! 🎉", "success");
        }
      })
      .catch((err) => {
        if (err.response.data.message === "User already subscribed") {
          toastMessage("You're already receiving our updates!", "warning");
        } else {
          toastMessage(
            "Something went wrong. Please try again later.",
            "error"
          );
        }
      });
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative px-4 pb-16 xl:px-0 overflow-hidden"
    >
      {/* Background Elements */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.03, 0.05, 0.03] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-lime-400 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-emerald-500 blur-3xl"
      />

      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
            Elevate Your Fitness Journey
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Join our community and receive exclusive content, workout plans, and
            nutrition tips straight to your inbox.
          </p>
        </motion.div>

        {/* Form Layout (No functionality) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 md:p-10 border border-gray-800 shadow-2xl"
        >
          <form onSubmit={handleNewsLetter} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-lime-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    defaultValue={user?.displayName && user?.displayName}
                    readOnly={!!user?.displayName}
                    placeholder="Enter your name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-lime-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    defaultValue={user?.email && user?.email}
                    readOnly={!!user?.email}
                    placeholder="your@email.com"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 bg-gradient-to-r from-lime-500 to-emerald-500 text-black hover:shadow-lg hover:shadow-lime-400/20 transition-all cursor-pointer"
              >
                <FaPaperPlane className="text-lg" />
                Subscribe Now
              </motion.button>
            </div>
          </form>

          <p className="mt-4 text-center text-xs text-gray-400">
            We respect your privacy. Unsubscribe anytime with one click.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Newsletter;
