import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaCalendarAlt,
  FaDumbbell,
  FaCertificate,
  FaUserTie,
  FaMedal,
} from "react-icons/fa";
import Loading from "../../Shared/Loading";
import BecomeTrainerCTA from "../../components/BecomeTrainerCTA";
import CustomHelmet from "../../Shared/CustomHelmet";

const TrainersDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const classId = new URLSearchParams(location.search).get("classId");
  const axiosSecure = useAxiosSecure();

  const { data: trainer = {}, isLoading } = useQuery({
    queryKey: ["trainer-by-id", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/trainer/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="pt-24 pb-16 px-4">
      <CustomHelmet
        title="FitForge - Trainer Details"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      <div className="max-w-6xl mx-auto">
        <BecomeTrainerCTA />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Trainer Info Section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl flex-1">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-lime-400/20 blur-md"></div>
                  <img
                    src={trainer.photoURL || "/default-avatar.jpg"}
                    alt={trainer.name}
                    className="relative w-40 h-40 object-cover rounded-full border-4 border-lime-400/50 shadow-lg z-10"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                      {trainer.name}
                    </h1>
                    <div className="flex items-center gap-2 text-lime-400">
                      <FaMedal className="text-amber-400" />
                      <span className="font-medium">
                        {trainer.trainerApplication?.experience} years
                        experience
                      </span>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-4">
                    {trainer.trainerApplication?.facebook && (
                      <a
                        href={trainer.trainerApplication.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lime-400 hover:text-white text-xl transition-colors"
                      >
                        <FaFacebook />
                      </a>
                    )}
                    {trainer.trainerApplication?.instagram && (
                      <a
                        href={trainer.trainerApplication.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lime-400 hover:text-white text-xl transition-colors"
                      >
                        <FaInstagram />
                      </a>
                    )}
                    {trainer.trainerApplication?.linkedin && (
                      <a
                        href={trainer.trainerApplication.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lime-400 hover:text-white text-xl transition-colors"
                      >
                        <FaLinkedin />
                      </a>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 mb-6">
                  <div className="flex items-center gap-3 bg-gray-700/50 p-3 rounded-lg">
                    <FaUserTie className="text-lime-400 text-xl" />
                    <div>
                      <div className="text-xs text-gray-400">Age</div>
                      <div className="font-medium">
                        {trainer.trainerApplication?.age}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-700/50 p-3 rounded-lg">
                    <FaCertificate className="text-lime-400 text-xl" />
                    <div>
                      <div className="text-xs text-gray-400">
                        Certifications
                      </div>
                      <div className="font-medium">
                        {trainer.trainerApplication?.certifications}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expertise Section */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-lime-400 mb-3 flex items-center gap-2">
                    <FaDumbbell /> Expertise
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {trainer.trainerApplication?.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-lime-400/10 text-lime-400 px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="border-t border-gray-700 pt-6">
              <h2 className="text-xl font-bold text-lime-400 mb-4">About Me</h2>
              <p className="text-gray-300">
                Certified {trainer.trainerApplication?.certifications}{" "}
                professional trainer with{" "}
                <span className="text-lime-400 font-medium">
                  {trainer.trainerApplication?.experience} years
                </span>{" "}
                of experience. Specializing in{" "}
                <span className="text-lime-400 font-medium">
                  {trainer.trainerApplication?.skills?.slice(0, 3).join(", ")}
                </span>{" "}
                and dedicated to helping clients achieve their fitness goals
                through personalized training programs and holistic wellness
                approaches.
              </p>
            </div>
          </div>

          {/* Available Slots Section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl lg:max-w-md w-full h-min sticky top-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-lime-400 flex items-center gap-3">
                <FaCalendarAlt className="text-lime-400" /> Available Sessions
              </h2>
              <p className="text-gray-400 mt-2">
                Book your personalized training session at your preferred time
              </p>
            </div>

            {/* Slot Cards Grid */}
            <div className="grid grid-cols-1 gap-4">
              {trainer.trainerApplication?.slots?.length > 0 ? (
                trainer.trainerApplication.slots.map((slot, index) => {
                  const slotString = `${slot.day} ${slot.time}`;
                  return (
                    <Link
                      key={index}
                      to={`/book-trainer/${
                        trainer._id
                      }?slot=${encodeURIComponent(
                        slotString
                      )}&classId=${classId}`}
                      className="bg-gray-700 hover:bg-gray-600 border border-lime-400/30 rounded-xl p-4 text-center text-white font-medium transition-colors"
                    >
                      {slot.day} {slot.time}
                    </Link>
                  );
                })
              ) : (
                <p className="text-gray-400 col-span-2 text-center py-4">
                  No available slots at the moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainersDetails;
