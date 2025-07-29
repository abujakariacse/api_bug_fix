/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaDumbbell,
  FaTrophy,
} from "react-icons/fa";
import { FaFire } from "react-icons/fa6";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Loading from "../Shared/Loading";
import { Link } from "react-router";

const TeamSection = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: trainers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featuredTrainers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/top-trainers");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading trainers: {error.message}
      </div>
    );
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.8,
      },
    },
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={container}
      className="pb-16 px-4 xl:px-0  max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.03, 0.05, 0.03],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-lime-400 blur-3xl z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.06, 0.03],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-emerald-500 blur-3xl -z-10"
      />

      {/* Section header */}
      <div className="text-center mb-6">
        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            duration: 0.8,
          }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent"
        >
          Meet Our Expert Team
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: "easeOut",
          }}
          viewport={{ once: true }}
          className="text-gray-300 max-w-2xl mx-auto"
        >
          Our certified professionals bring years of experience and passion to
          help you achieve your fitness goals.
        </motion.p>
      </div>

      {/* Trainers grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {trainers.map((trainer, index) => (
          <motion.div
            key={trainer._id}
            variants={item}
            whileHover="hover"
            className="relative group"
          >
            {/* Trainer card */}
            <div className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-lime-400/30 transition-all h-full flex flex-col">
              {/* Improved image container */}
              <div className="relative pt-12 px-6">
                <div className="relative mx-auto w-32 h-32 rounded-full border-4 border-lime-400/50 overflow-hidden shadow-lg bg-gray-700">
                  <motion.img
                    src={trainer.photoURL || "/default-avatar.jpg"}
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "top center" }}
                    whileHover={{
                      scale: 1.1,
                      transition: { duration: 0.5 },
                    }}
                  />
                </div>
                {/* Top badge - positioned over the image */}
                {index < 2 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <FaFire className="text-xs" />
                    {index === 0 ? "Lead Trainer" : "Top Coach"}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col mt-2">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-center w-full">
                    <h3 className="text-xl font-bold text-white">
                      {trainer.name}
                    </h3>
                    <p className="text-lime-400 text-sm">
                      {trainer.trainerApplication?.title ||
                        "Certified Fitness Trainer"}
                    </p>
                  </div>
                </div>

                {/* Experience badge - moved under name */}
                <div className="flex justify-center mb-4">
                  <div className="flex items-center bg-gray-700 px-3 py-1 rounded-full">
                    <FaTrophy className="text-amber-400 mr-1 text-xs" />
                    <span className="text-lime-400 text-xs">
                      {trainer.trainerApplication?.experience || "5"}yrs
                      experience
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-300 text-sm mb-4 text-center line-clamp-3">
                  {trainer.trainerApplication?.bio ||
                    "Passionate about helping clients achieve their fitness goals through personalized training programs."}
                </p>

                {/* Expertise */}
                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-3 justify-center">
                    <FaDumbbell className="text-lime-400" />
                    <h4 className="text-sm font-semibold text-white">
                      Specializations
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {trainer.trainerApplication?.skills
                      ?.slice(0, 3)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="bg-gray-700/50 text-lime-400 text-xs px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    {trainer.trainerApplication?.skills?.length > 3 && (
                      <span className="bg-gray-700/50 text-gray-400 text-xs px-2 py-1 rounded-full">
                        +{trainer.trainerApplication.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Social links */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="flex gap-3 mt-6 pt-4 border-t border-gray-700 justify-center"
                >
                  {trainer.trainerApplication?.linkedin && (
                    <a
                      href={trainer.trainerApplication.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#0077b5] transition-colors"
                    >
                      <FaLinkedin className="text-lg" />
                    </a>
                  )}
                  {trainer.trainerApplication?.instagram && (
                    <a
                      href={trainer.trainerApplication.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#E1306C] transition-colors"
                    >
                      <FaInstagram className="text-lg" />
                    </a>
                  )}
                  {trainer.trainerApplication?.twitter && (
                    <a
                      href={trainer.trainerApplication.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#1DA1F2] transition-colors"
                    >
                      <FaTwitter className="text-lg" />
                    </a>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.8,
          type: "spring",
          stiffness: 100,
        }}
        viewport={{ once: true }}
        className="text-center mt-6"
      >
        <Link
          to="/trainers"
          className="inline-flex items-center gap-2 bg-transparent border border-lime-400 hover:bg-lime-400/10 text-lime-400 font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-lime-400/20 group"
        >
          Meet All Our Trainers
          <span className="group-hover:translate-x-1 transition-transform">
            &rarr;
          </span>
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default TeamSection;
