/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegComment, FaRegHeart, FaArrowRight, FaFire } from "react-icons/fa";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Loading from "../Shared/Loading";

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
    scale: 0.95,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
  hover: {
    y: -5,
    scale: 1.02,
    boxShadow: "0px 10px 25px rgba(163, 230, 53, 0.3)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const ForumHome = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch latest 6 forum posts
  const {
    data: forums = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["forums-six"],
    queryFn: async () => {
      const res = await axiosSecure.get("/forums-six");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;
  if (isError) return <h1>Error...{error.message}</h1>;

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="px-4 xl:px-0 max-w-7xl mx-auto relative overflow-hidden py-16"
    >
      {/* Animated Background Elements */}
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
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-lime-400 blur-3xl -z-10"
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

      {/* Section Header */}
      <div className="text-center mb-10">
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
          Community Discussions
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
          Join the conversation with our vibrant community. Share your thoughts,
          get advice, and connect with fellow fitness enthusiasts.
        </motion.p>
      </div>

      {/* Forums Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
      >
        <AnimatePresence>
          {forums.map((forum, index) => (
            <motion.div
              key={forum._id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-lime-400/30 transition-all"
            >
              <Link to={`/forums/${forum._id}`} className="block">
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={forum.imageUrl}
                    alt={forum.forumTitle}
                    className="w-full h-full object-cover"
                    whileHover={{
                      scale: 1.1,
                      transition: { duration: 0.5, ease: "easeOut" },
                    }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <motion.span
                        className="bg-lime-500/90 text-black text-xs font-bold px-2 py-1 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        {forum.role}
                      </motion.span>
                      {index < 3 && (
                        <motion.span
                          className="flex items-center gap-1 bg-amber-500/90 text-black text-xs font-bold px-2 py-1 rounded-full"
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: "easeInOut",
                          }}
                        >
                          <FaFire className="text-xs" /> Hot
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.img
                      src={forum.userPhotoURL}
                      alt={forum.userName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-lime-400/50"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div>
                      <h4 className="font-medium text-gray-200">
                        {forum.userName}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {new Date(forum.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <motion.h3
                    className="text-xl font-bold mb-3 text-lime-400"
                    whileHover={{ x: 5 }}
                  >
                    {forum.forumTitle}
                  </motion.h3>

                  <motion.p
                    className="text-gray-300 mb-5 line-clamp-2"
                    whileHover={{ color: "#ffffff" }}
                  >
                    {forum.forumDescription}
                  </motion.p>

                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <motion.div
                      className="flex items-center gap-2 text-sm text-gray-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      <FaRegHeart className="text-lime-400" />
                      <span>{forum.likes?.length || 0} likes</span>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.8,
          type: "spring",
          stiffness: 100,
        }}
        viewport={{ once: true }}
        className="text-center mt-10"
      >
        <Link
          to="/forums"
          className="inline-flex items-center gap-2 bg-transparent border border-lime-400 hover:bg-lime-400/10 text-lime-400 font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-lime-400/20 group"
        >
          View All Discussions
          <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default ForumHome;
