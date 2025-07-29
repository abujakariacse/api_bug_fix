/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const StatCard = ({ icon, title, value, description, color }) => {
  const colorClasses = {
    lime: "bg-lime-400/10 text-lime-400",
    blue: "bg-blue-400/10 text-blue-400",
    amber: "bg-amber-400/10 text-amber-400",
    purple: "bg-purple-400/10 text-purple-400",
  };

  return (
    <motion.div
      className="bg-gray-800 p-4 rounded-xl border border-gray-700"
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
      }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className={`${colorClasses[color]} p-2 rounded-lg`}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {icon}
        </motion.div>
        <div>
          <motion.h3
            className="text-gray-400 text-xs font-medium"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {title}
          </motion.h3>
          <motion.p
            className="text-lg font-bold text-white mt-1"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            {value}
          </motion.p>
          <motion.p
            className="text-gray-400 text-xs mt-1"
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
          >
            {description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
