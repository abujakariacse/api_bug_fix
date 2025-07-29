/* eslint-disable no-unused-vars */
import { Link } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomHelmet from "../../Shared/CustomHelmet";

const Forbidden = () => {
  return (
    <div className="bg-black min-h-svh w-full flex flex-col justify-center items-center relative overflow-hidden">
      <CustomHelmet
        title="FitForge - Forbidden"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      {/* Forbidden video */}
      <div className="w-full max-w-4xl">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto"
          src="https://res.cloudinary.com/ddckuxsjx/video/upload/v1752674529/403Forbidden_knp2nj.mp4"
        ></video>
      </div>

      {/* Persistent animated button with multiple effects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              "0 20px 25px -5px rgba(255, 255, 255, 0.1), 0 10px 10px -5px rgba(255, 255, 255, 0.04)",
              "0 20px 25px -5px rgba(255, 255, 255, 0.2), 0 10px 10px -5px rgba(255, 255, 255, 0.1)",
              "0 20px 25px -5px rgba(255, 255, 255, 0.1), 0 10px 10px -5px rgba(255, 255, 255, 0.04)",
            ],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Link
            to="/"
            className="flex items-center gap-3 px-10 py-3 text-xl font-semibold bg-white text-black rounded-full transition-all duration-300 group"
          >
            <motion.span
              animate={{
                x: [0, -3, 3, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FaArrowLeft />
            </motion.span>
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Additional message */}
      <motion.p
        className="text-white mt-6 text-lg text-center max-w-md px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        You don't have permission to access this page.
      </motion.p>
    </div>
  );
};

export default Forbidden;
