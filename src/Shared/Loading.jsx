/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaDumbbell, FaHeartbeat } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 gap-6">
      {/* Animated dumbbell loader */}
      <motion.div
        className="flex items-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          animate={{
            rotate: [0, -15, 0, 15, 0],
            y: [0, -10, 0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <FaDumbbell className="text-5xl text-lime-400" />
        </motion.div>

        <motion.div
          animate={{
            rotate: [0, 15, 0, -15, 0],
            y: [0, -10, 0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
            delay: 0.3,
          }}
        >
          <GiWeightLiftingUp className="text-5xl text-lime-400" />
        </motion.div>
      </motion.div>

      {/* Pulsing heartbeat */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "easeInOut",
        }}
      >
        <FaHeartbeat className="text-4xl text-red-500" />
      </motion.div>

      {/* Text animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-2">FitForge</h1>
        <motion.p
          className="text-gray-400"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          Building your fitness journey...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loading;
