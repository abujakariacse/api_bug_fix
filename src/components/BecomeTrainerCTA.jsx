/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Link } from "react-router";
import { FaDumbbell } from "react-icons/fa";

const BecomeTrainerCTA = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-l-8 border-lime-400 p-10 rounded-2xl shadow-xl overflow-hidden mb-16"
    >
      {/* Floating background blur elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-lime-400/10 blur-2xl rounded-full animate-pulse" />
      <div className="absolute -bottom-14 -left-14 w-44 h-44 bg-lime-400/5 blur-xl rounded-full animate-pulse delay-1000" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left max-w-xl space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-extrabold text-white"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-emerald-400">
              Ready to Transform Lives?
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-gray-300 text-lg"
          >
            Join our elite team of fitness professionals and inspire others with
            your passion and skills. It's time to make a difference.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/beTrainer">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 25px rgba(132, 204, 22, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 font-bold px-8 py-4 rounded-lg text-lg flex items-center gap-2 relative overflow-hidden cursor-pointer"
            >
              <span className="z-10 flex items-center gap-2">
                <FaDumbbell className="text-xl" />
                Become a Trainer
              </span>
              {/* Shine effect */}
              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 bg-white/20 blur-sm"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                }}
              />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BecomeTrainerCTA;
