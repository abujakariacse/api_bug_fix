/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  FaHeartbeat,
  FaDumbbell,
  FaUserFriends,
  FaMobileAlt,
} from "react-icons/fa";
import image from "../assets/personalized-workouts-animate.svg";

const About = () => {
  return (
    <section className="px-6 text-white flex items-center justify-center max-w-6xl mx-auto mt-16 md:mt-0">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 items-center"
      >
        {/* Left - Text */}
        <div>
          <motion.h2
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold pb-4 bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent"
          >
            About FitForge
          </motion.h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            <span className="font-semibold text-white">FitForge</span> is your
            all-in-one fitness companion, built to help you forge a stronger,
            healthier lifestyle. Whether you're just starting your fitness
            journey or pushing for new personal bests, FitForge provides tools,
            community, and guidance to support your goals.
          </p>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <FaHeartbeat className="text-emerald-500 text-xl mt-1" />
              <span>Track your fitness goals and progress in real-time.</span>
            </li>
            <li className="flex items-start gap-3">
              <FaDumbbell className="text-lime-500 text-xl mt-1" />
              <span>
                Access customized workout routines tailored to your level.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaUserFriends className="text-indigo-400 text-xl mt-1" />
              <span>
                Connect with other fitness enthusiasts and join challenges.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaMobileAlt className="text-pink-400 text-xl mt-1" />
              <span>
                Mobile-friendly and responsive for workouts on-the-go.
              </span>
            </li>
          </ul>
        </div>

        {/* Right - Image or Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <img src={image} alt="FitForge Illustration" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
