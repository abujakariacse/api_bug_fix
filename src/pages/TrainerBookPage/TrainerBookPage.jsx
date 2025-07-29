/* eslint-disable no-unused-vars */
import { useLocation, Link, useParams, useNavigate } from "react-router";
import {
  FaCheck,
  FaArrowRight,
  FaUserAlt,
  FaCalendarDay,
  FaExclamationTriangle,
  FaTimes,
  FaUserShield,
} from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Shared/Loading";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, staggerContainer, slideIn, zoomIn } from "../../utils/motion";
import useAuth from "../../Hooks/useAuth";
import toastMessage from "../../utils/toastMessage";
import useUserRole from "../../Hooks/useUserRole";
import CustomHelmet from "../../Shared/CustomHelmet";

const TrainerBookPage = () => {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const slotParam = queryParams.get("slot");
  const classId = queryParams.get("classId");
  const { role: userRole } = useUserRole();

  // Parse the slot parameter into day and time
  let day = "";
  let time = "";
  if (slotParam) {
    // Find the first space to separate day and time
    const firstSpaceIndex = slotParam.indexOf(" ");
    if (firstSpaceIndex !== -1) {
      day = slotParam.substring(0, firstSpaceIndex);
      time = slotParam.substring(firstSpaceIndex + 1);
    }
  }

  const {
    data: trainer = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trainer-by-id", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/trainer/${id}`);
      return res.data;
    },
  });

  const packages = [
    {
      name: "Basic Membership",
      price: "$10",
      features: [
        "Access to gym facilities during regular hours",
        "Use of cardio and strength training equipment",
        "Access to locker rooms and showers",
      ],
    },
    {
      name: "Standard Membership",
      price: "$50",
      features: [
        "All benefits of basic membership",
        "Access to group fitness classes",
        "Use of additional amenities",
      ],
    },
    {
      name: "Premium Membership",
      price: "$100",
      features: [
        "All benefits of standard membership",
        "Personal training sessions",
        "Discounts on additional services",
      ],
    },
  ];

  // Check if the current slot is already booked by the user - UPDATED
  const isSlotBooked = (pkgName) => {
    if (!trainer.activityLog?.bookedSlots || !user?.email) {
      return false;
    }

    return trainer.activityLog.bookedSlots.some((slot) => {
      // Compare both day and time separately
      const sameDay = slot.slot.day === day;
      const sameTime = slot.slot.time === time;
      const samePackage = slot.package === pkgName;
      const sameUser = slot.userEmail === user.email;

      return sameDay && sameTime && samePackage && sameUser;
    });
  };

  // Check if user is admin or trainer
  const isAdminOrTrainer = userRole === "admin" || userRole === "trainer";

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-24 pb-16 flex items-center justify-center"
      >
        <CustomHelmet
          title="FitForge - Book Trainer"
          meta={[
            { name: "description", content: "Learn more about our website." },
            { property: "og:title", content: "About Us - My Website" },
          ]}
        />
        <motion.div
          variants={zoomIn(0.2, 1)}
          initial="hidden"
          animate="show"
          className="text-center p-6 bg-gray-800 rounded-xl max-w-md"
        >
          <FaExclamationTriangle className="text-red-400 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Failed to load trainer data
          </h2>
          <p className="text-gray-400 mb-4">
            {error.message || "Please try again later"}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-medium py-2 px-4 rounded"
          >
            Go Back
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  if (!slotParam || !day || !time) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-24 pb-16 flex items-center justify-center"
      >
        <motion.div
          variants={zoomIn(0.2, 1)}
          initial="hidden"
          animate="show"
          className="text-center p-6 bg-gray-800 rounded-xl max-w-md"
        >
          <FaExclamationTriangle className="text-yellow-400 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Missing Booking Information
          </h2>
          <p className="text-gray-400 mb-4">
            Please select a time slot from the trainer's profile
          </p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to={`/trainers/${id}`}
              className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-medium py-2 px-4 rounded inline-block"
            >
              Select Time Slot
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  const slot = { day, time };

  const handleSelectPlan = (pkg) => {
    if (isAdminOrTrainer) {
      toastMessage(
        "Admins and trainers cannot book training sessions",
        "warning"
      );
      return;
    }

    if (isSlotBooked(pkg.name)) {
      toastMessage(
        "You have already booked this slot with this package",
        "warning"
      );
      return;
    }

    const paymentHistory = {
      trainerId: id,
      trainer: trainer.name,
      trainerImage: trainer.photoURL,
      trainerSkills: trainer.trainerApplication?.skills || [],
      slot: slot,
      package: pkg.name,
      price: pkg.price,
      paymentStatus: "pending",
      userImage: user.photoURL,
      userEmail: user.email,
    };

    if (classId) {
      paymentHistory.classId = classId;
    }

    axiosSecure
      .patch(`/users/activity/${user.email}`, paymentHistory)
      .then((res) => {
        navigate(`/payment/${res.data.upsertedId}`);
      })
      .catch((err) => {
        err && toastMessage("Something went wrong please try again", "error");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-16 pt-24 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={staggerContainer(0.1, 0.3)}
          initial="hidden"
          animate="show"
          className="bg-gray-800 rounded-xl p-8 border border-lime-400/20"
        >
          {/* Booking Summary */}
          <motion.div
            variants={fadeIn("up", "tween", 0.2, 1)}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold text-lime-400 mb-6">
              Confirm Your Booking
            </h1>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <motion.div variants={zoomIn(0.3, 1)} className="flex-shrink-0">
                <img
                  src={trainer.photoURL || "/default-avatar.jpg"}
                  alt={trainer.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-lime-400/30 hover:border-lime-400/60 transition-all duration-300"
                  onError={(e) => {
                    e.target.src = "/default-avatar.jpg";
                  }}
                />
              </motion.div>

              <motion.div
                variants={fadeIn("left", "tween", 0.4, 1)}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <FaUserAlt className="text-lime-400" />
                  <h2 className="text-2xl font-bold text-white">
                    {trainer.name}
                  </h2>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-3 text-gray-300">
                    <FaCalendarDay className="text-lime-400" />
                    <span className="font-medium">Selected Slot:</span>
                  </div>
                  <div className="ml-6 mt-1 bg-gray-700/50 px-4 py-2 rounded-lg">
                    <span className="font-medium text-white">{slotParam}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-lime-400 mb-2">
                    Specialties:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {(trainer.trainerApplication?.skills || []).map(
                        (skill, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-lime-400 hover:text-gray-900 transition-colors"
                          >
                            {skill}
                          </motion.span>
                        )
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Membership Packages */}
          <motion.div
            variants={fadeIn("up", "tween", 0.6, 1)}
            className="mb-10"
          >
            <h2 className="text-2xl font-bold text-lime-400 mb-6">
              Choose Your Membership
            </h2>

            {isAdminOrTrainer ? (
              <motion.div
                variants={zoomIn(0.2, 1)}
                className="text-center p-6 bg-gray-700 rounded-xl border border-yellow-400/30"
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <FaUserShield className="text-yellow-400 text-4xl" />
                  <h3 className="text-xl font-bold text-white">
                    {userRole === "admin" ? "Admin Access" : "Trainer Access"}
                  </h3>
                  <p className="text-gray-300">
                    {userRole === "admin"
                      ? "Admins cannot book training sessions."
                      : "Trainers cannot book other trainers' sessions."}
                  </p>
                  <Link
                    to="/dashboard"
                    className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2 px-4 rounded inline-flex items-center gap-2"
                  >
                    Go to Dashboard <FaArrowRight />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatePresence>
                  {packages.map((pkg, index) => {
                    const isBooked = isSlotBooked(pkg.name);
                    return (
                      <motion.div
                        key={index}
                        variants={slideIn("up", "tween", index * 0.1, 0.5)}
                        initial="hidden"
                        animate="show"
                        whileHover={!isBooked ? { y: -10 } : {}}
                        className={`bg-gray-700 rounded-xl p-6 border-2 ${
                          index === 1 ? "border-lime-400" : "border-gray-600"
                        } ${
                          isBooked
                            ? "border-red-400/50 opacity-80"
                            : "hover:border-lime-400"
                        } transition-all duration-300 shadow-lg ${
                          isBooked
                            ? "hover:shadow-red-400/10"
                            : "hover:shadow-lime-400/20"
                        } relative`}
                      >
                        {isBooked && (
                          <div className="absolute top-4 right-4 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <FaTimes /> Booked
                          </div>
                        )}

                        <h3 className="text-xl font-bold text-white mb-3">
                          {pkg.name}
                        </h3>
                        <div className="text-3xl font-bold text-lime-400 mb-4">
                          {pkg.price}
                          <span className="text-sm text-gray-400 font-normal ml-1">
                            /session
                          </span>
                        </div>

                        <ul className="space-y-3 mb-6">
                          {pkg.features.map((feature, i) => (
                            <motion.li
                              key={i}
                              whileHover={{ x: 5 }}
                              className="flex items-start gap-2 text-gray-300"
                            >
                              <FaCheck className="text-lime-400 mt-1 flex-shrink-0" />
                              <span>{feature}</span>
                            </motion.li>
                          ))}
                        </ul>

                        {isBooked ? (
                          <motion.button
                            disabled
                            className="w-full text-center py-3 px-6 rounded-lg font-bold bg-gray-500 text-gray-300 cursor-not-allowed"
                          >
                            Already Booked <FaTimes className="inline ml-2" />
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectPlan(pkg)}
                            className={`w-full text-center py-3 px-6 rounded-lg font-bold transition-all duration-300 cursor-pointer ${
                              index === 1
                                ? "bg-lime-400 hover:bg-lime-500 text-gray-900"
                                : "bg-gray-600 hover:bg-gray-500 text-white"
                            }`}
                          >
                            Select Plan <FaArrowRight className="inline ml-2" />
                          </motion.button>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Navigation */}
          <motion.div
            variants={fadeIn("up", "tween", 0.8, 1)}
            className="flex justify-between"
          >
            <motion.div whileHover={{ x: -5 }}>
              <Link
                to={`/trainers/${id}`}
                className="text-gray-400 hover:text-lime-400 flex items-center gap-2 cursor-pointer transition-colors"
              >
                ← Back to trainer profile
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TrainerBookPage;
