/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaUsers,
  FaDumbbell,
  FaHeart,
  FaCalendarCheck,
  FaComments,
} from "react-icons/fa";

const features = [
  {
    icon: <FaChartLine className="text-4xl text-lime-400" />,
    title: "Track Progress",
    description:
      "Monitor your fitness journey with powerful analytics and activity logs.",
  },
  {
    icon: <FaDumbbell className="text-4xl text-lime-400" />,
    title: "Expert Trainers",
    description:
      "Access certified trainers, view their slots, and book personal sessions.",
  },
  {
    icon: <FaHeart className="text-4xl text-lime-400" />,
    title: "Health Goals",
    description:
      "Set personalized health and workout goals and measure your success.",
  },
  {
    icon: <FaCalendarCheck className="text-4xl text-lime-400" />,
    title: "Class Scheduling",
    description:
      "Browse available classes and book sessions that fit your routine.",
  },
  {
    icon: <FaUsers className="text-4xl text-lime-400" />,
    title: "Community Support",
    description:
      "Engage in forums, vote on topics, and connect with other fitness enthusiasts.",
  },
  {
    icon: <FaComments className="text-4xl text-lime-400" />,
    title: "Real Reviews",
    description:
      "See what others say about trainers and classes through dynamic testimonials.",
  },
];

const Featured = () => {
  return (
    <section className="text-white py-16 px-4 xl:px-0 max-w-7xl mx-auto">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
          Why Choose <span className="text-lime-400">FitForge?</span>
        </h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          FitForge empowers your fitness journey with powerful tools, expert
          guidance, and a community that cares.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 4px 15px rgba(163, 230, 53, 0.3)",
                transitionDuration: "0.14s",
              }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white/5 p-6 rounded-2xl border border-white/10 cursor-pointer"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-lime-400">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured;
