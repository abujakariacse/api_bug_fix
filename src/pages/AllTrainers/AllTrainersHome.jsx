/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Shared/Loading";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaCalendarAlt,
  FaStar,
  FaDumbbell,
} from "react-icons/fa";
import { Link } from "react-router";
import { motion } from "framer-motion";
import CustomHelmet from "../../Shared/CustomHelmet";

const AllTrainersHome = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: trainers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trainers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/trainers");
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

  return (
    <div className="pt-24 px-4 pb-12">
      <CustomHelmet
        title="FitForge - Trainers"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-lime-400 mb-2">
            Meet Our Expert Coaches
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Certified professionals ready to transform your fitness journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trainers.map((trainer) => (
            <motion.div
              key={trainer._id}
              whileHover={{ y: -8 }}
              className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-lime-400/20 transition-all duration-300 border border-gray-700 relative"
            >
              {/* Profile Image */}
              <div className="relative h-40 bg-gray-700 flex items-center justify-center">
                <img
                  src={trainer.photoURL || "/default-avatar.jpg"}
                  alt={trainer.name}
                  className="w-28 h-28 object-cover rounded-full border-4 border-gray-800 shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Social Icons - Appear on Card Hover */}
              <motion.div className="absolute top-30 right-1 flex gap-1 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {trainer.trainerApplication?.facebook && (
                  <a
                    href={trainer.trainerApplication.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900/80 p-2 rounded-full text-lime-400 hover:text-white hover:bg-lime-400 transition-colors"
                  >
                    <FaFacebook />
                  </a>
                )}
                {trainer.trainerApplication?.instagram && (
                  <a
                    href={trainer.trainerApplication.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900/80 p-2 rounded-full text-lime-400 hover:text-white hover:bg-lime-400 transition-colors"
                  >
                    <FaInstagram />
                  </a>
                )}
                {trainer.trainerApplication?.linkedin && (
                  <a
                    href={trainer.trainerApplication.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900/80 p-2 rounded-full text-lime-400 hover:text-white hover:bg-lime-400 transition-colors"
                  >
                    <FaLinkedin />
                  </a>
                )}
              </motion.div>

              {/* Trainer Info */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {trainer.name}
                  </h3>
                  <div className="flex items-center bg-gray-700 px-2 py-1 rounded-full">
                    <FaStar className="text-amber-400 mr-1 text-xs" />
                    <span className="text-lime-400 text-sm">
                      {trainer.trainerApplication?.experience}yrs
                    </span>
                  </div>
                </div>

                {/* Specializations */}
                {trainer.trainerApplication?.skills?.length > 0 && (
                  <div className="mb-3 flex items-center gap-3">
                    <FaDumbbell className="text-lime-400 text-sm" />
                    <p className="text-gray-400 text-sm truncate">
                      {trainer.trainerApplication.skills.slice(0, 3).join(", ")}
                      {trainer.trainerApplication.skills.length > 3
                        ? "..."
                        : ""}
                    </p>
                  </div>
                )}

                {/* Availability */}
                <div className="flex items-center gap-3 text-gray-400 text-sm mb-4">
                  <FaCalendarAlt className="text-lime-400" />
                  <div>
                    <p className="text-white text-xs">
                      {trainer.trainerApplication?.slots
                        ?.slice(0, 1)
                        .map((slot) => `${slot.day} (${slot.time})`)
                        .join(", ")}
                      {trainer.trainerApplication?.slots?.length > 3
                        ? "..."
                        : ""}
                    </p>
                  </div>
                </div>

                {/* View Profile Button */}
                <Link
                  to={`/trainers/${trainer._id}`}
                  className="block w-full bg-lime-400 hover:bg-lime-500 text-gray-900 font-medium py-2 px-4 rounded-lg text-center transition-colors text-sm"
                >
                  View Profile
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllTrainersHome;
