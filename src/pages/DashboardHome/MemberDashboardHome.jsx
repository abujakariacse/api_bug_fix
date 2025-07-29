/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Shared/Loading";
import {
  FaDumbbell,
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaDollarSign,
  FaCheckCircle,
  FaHourglassHalf,
  FaUser,
  FaRegUserCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import StatCard from "../../components/StatCard";
import { Link } from "react-router";
import useAuth from "../../Hooks/useAuth";
import CustomHelmet from "../../Shared/CustomHelmet";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const MemberDashboardHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch member data
  const {
    data: memberData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["member-dashboard"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/activity?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 text-center mt-8"
      >
        Failed to load dashboard data
      </motion.div>
    );

  // Get booked trainers with paymentStatus 'paid'
  const bookedTrainers =
    memberData?.activityLog?.paymentHistory
      ?.filter((booking) => booking.paymentStatus === "paid")
      .slice(0, 3) // Show latest 3 bookings
      .map((booking) => ({
        ...booking,
      })) || [];

  // Get pending payments
  const pendingPayments =
    memberData?.activityLog?.paymentHistory
      ?.filter((payment) => payment.paymentStatus === "pending")
      .slice(0, 3) || [];

  // Stats
  const totalClasses = bookedTrainers.length || 0;
  const activeMemberships = bookedTrainers.length;
  const pendingPaymentsCount = pendingPayments.length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 sm:p-6 bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl space-y-8"
    >
      <CustomHelmet
        title="FitForge - Member Dashboard"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <FaDumbbell className="text-lime-400 text-3xl" />
            Welcome Back, {memberData.name || "Member"}!
          </h1>
          <p className="text-gray-400 mt-2">
            Here's your fitness journey at a glance
          </p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
          <FaCalendarAlt className="text-lime-400" />
          <span className="text-white">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<FaDumbbell className="text-lime-400 text-xl" />}
            title="Total Classes"
            value={totalClasses}
            description="All booked sessions"
            color="lime"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<FaCheckCircle className="text-emerald-400 text-xl" />}
            title="Active Memberships"
            value={activeMemberships}
            description="Currently active"
            color="emerald"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<FaHourglassHalf className="text-amber-400 text-xl" />}
            title="Pending Payments"
            value={pendingPaymentsCount}
            description="Awaiting confirmation"
            color="amber"
          />
        </motion.div>
      </motion.div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booked Trainers (Paid Only) */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaUserTie className="text-lime-400" />
              Booked Trainers
            </h2>
            <Link
              to="/dashboard/bookedTrainer"
              className="text-lime-400 hover:text-lime-300 text-sm"
            >
              View All
            </Link>
          </div>

          {bookedTrainers.length > 0 ? (
            <div className="space-y-4">
              {bookedTrainers.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  variants={itemVariants}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-lime-400/30 transition-all"
                >
                  {/* Trainer Avatar */}
                  <div className="flex-shrink-0">
                    {booking?.trainerImage ? (
                      <img
                        src={booking.trainerImage}
                        alt={booking.trainer}
                        className="w-12 h-12 rounded-full object-cover border-2 border-lime-400/50"
                      />
                    ) : (
                      <FaRegUserCircle
                        size={40}
                        className="rounded-full text-lime-400/50"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-white">
                      {booking.trainer}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-sm bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {booking.slot.day}
                      </span>
                      <span className="text-sm bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {booking.slot.time}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-white font-medium">{booking.package}</p>
                    <div className="mt-1 flex flex-col items-end">
                      <p className="text-lime-400 text-sm">{booking.price}</p>
                      <span className="text-xs mt-1 px-2 py-1 rounded-full text-green-400 bg-green-900/30">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-700/30 rounded-xl p-6 border border-dashed border-gray-600">
                <p className="text-gray-400">No trainers booked yet</p>
                <Link
                  to="/trainers"
                  className="mt-4 inline-block text-lime-400 hover:text-lime-300"
                >
                  Book your first trainer
                </Link>
              </div>
            </div>
          )}
        </motion.div>

        {/* Pending Payments */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaDollarSign className="text-amber-400" />
              Pending Payments
            </h2>
            <Link
              to="/dashboard/activityLog"
              className="text-amber-400 hover:text-amber-300 text-sm"
            >
              View All
            </Link>
          </div>

          {pendingPayments.length > 0 ? (
            <div className="space-y-4">
              {pendingPayments.map((payment, index) => (
                <motion.div
                  key={payment._id}
                  variants={itemVariants}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-amber-400/30 transition-all"
                >
                  <div className="flex-shrink-0">
                    {payment.trainerImage ? (
                      <img
                        src={payment.trainerImage}
                        alt={payment.trainer}
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/50"
                      />
                    ) : (
                      <FaRegUserCircle
                        size={40}
                        className="rounded-full text-amber-400/50"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">
                      {payment.trainer}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {payment.package}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{payment.price}</p>
                    <span className="text-amber-400 text-xs mt-1 bg-amber-900/30 px-2 py-1 rounded-full">
                      Pending
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-700/30 rounded-xl p-6 border border-dashed border-gray-600">
                <p className="text-gray-400">No pending payments</p>
                <p className="text-green-400 text-sm mt-2">
                  All payments are confirmed!
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/classes"
            className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 hover:border-lime-400/30 transition-all text-center"
          >
            <div className="bg-lime-500/10 p-3 rounded-lg inline-flex">
              <FaDumbbell className="text-lime-400 text-2xl" />
            </div>
            <h3 className="font-medium text-white mt-3">Book a Class</h3>
            <p className="text-gray-400 text-sm mt-1">Find your next workout</p>
          </Link>

          <Link
            to="/trainers"
            className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 hover:border-lime-400/30 transition-all text-center"
          >
            <div className="bg-lime-500/10 p-3 rounded-lg inline-flex">
              <FaUserTie className="text-lime-400 text-2xl" />
            </div>
            <h3 className="font-medium text-white mt-3">Find a Trainer</h3>
            <p className="text-gray-400 text-sm mt-1">Expert guidance</p>
          </Link>

          <Link
            to="/dashboard/activityLog"
            className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 hover:border-lime-400/30 transition-all text-center"
          >
            <div className="bg-lime-500/10 p-3 rounded-lg inline-flex">
              <FaDollarSign className="text-lime-400 text-2xl" />
            </div>
            <h3 className="font-medium text-white mt-3">Payment History</h3>
            <p className="text-gray-400 text-sm mt-1">View transactions</p>
          </Link>

          <Link
            to="/dashboard/activityLog"
            className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 hover:border-lime-400/30 transition-all text-center"
          >
            <div className="bg-lime-500/10 p-3 rounded-lg inline-flex">
              <FaClock className="text-lime-400 text-2xl" />
            </div>
            <h3 className="font-medium text-white mt-3">Activity Log</h3>
            <p className="text-gray-400 text-sm mt-1">Track your progress</p>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MemberDashboardHome;
