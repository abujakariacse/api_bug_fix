/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Shared/Loading";
import {
  FaUser,
  FaDollarSign,
  FaCalendarAlt,
  FaClock,
  FaChartLine,
  FaUserTie,
} from "react-icons/fa";
import { MdFitnessCenter, MdClass } from "react-icons/md";
import { GiWeightLiftingUp } from "react-icons/gi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Link } from "react-router";
import StatCard from "../../components/StatCard";
import { motion } from "framer-motion";
import { IoIosArrowForward } from "react-icons/io";
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

const chartVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.3,
      duration: 0.5,
    },
  },
};

const TrainerDashboardHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch trainer data
  const {
    data: trainerData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trainer-dashboard", user?.email],
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
        Failed to load trainer data
      </motion.div>
    );

  // Prepare data for charts and stats
  const bookedSlots = trainerData?.activityLog?.bookedSlots || [];
  const availableSlots = trainerData?.trainerApplication?.slots || [];
  const skills = trainerData?.trainerApplication?.skills || [];

  // Calculate earnings
  const totalEarnings = bookedSlots.reduce(
    (sum, slot) => sum + parseInt(slot.price.replace("$", "")),
    0
  );

  // Prepare data for booking chart
  const bookingData = [
    { name: "Booked", value: bookedSlots.length },
    { name: "Available", value: availableSlots.length },
  ];

  // Prepare data for weekly schedule chart
  const weeklyScheduleData = [
    { day: "Mon", bookings: 0 },
    { day: "Tue", bookings: 0 },
    { day: "Wed", bookings: 0 },
    { day: "Thu", bookings: 0 },
    { day: "Fri", bookings: 0 },
    { day: "Sat", bookings: 0 },
    { day: "Sun", bookings: 0 },
  ];

  bookedSlots.forEach((slot) => {
    const dayIndex = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ].indexOf(slot.slot.day);
    if (dayIndex >= 0) {
      weeklyScheduleData[(dayIndex + 6) % 7].bookings++;
    }
  });

  // Colors for pie chart
  const COLORS = ["#a3e635", "#38bdf8"];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 sm:p-6 bg-gray-900 rounded-xl space-y-6"
    >
      <CustomHelmet
        title="FitForge - Trainer Dashboard"
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
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <GiWeightLiftingUp className="text-lime-400 text-3xl" />
            Trainer Dashboard
          </motion.h1>
          <motion.p
            className="text-gray-400 mt-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome back, {trainerData?.name}
          </motion.p>
        </div>
        <motion.div
          className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FaCalendarAlt className="text-lime-400" />
          <span className="text-white">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<FaUser className="text-blue-400 text-xl" />}
            title="Clients"
            value={bookedSlots.length}
            description="Active bookings"
            color="blue"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<FaDollarSign className="text-amber-400 text-xl" />}
            title="Earnings"
            value={`$${totalEarnings}`}
            description="Total revenue"
            color="amber"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<MdClass className="text-purple-400 text-xl" />}
            title="Slots"
            value={availableSlots.length}
            description="Available time slots"
            color="purple"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<FaUserTie className="text-lime-400 text-xl" />}
            title="Experience"
            value={`${trainerData?.trainerApplication?.experience || 0} yrs`}
            description="Training experience"
            color="lime"
          />
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        {/* Bookings Overview */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-gray-800 p-4 rounded-xl border border-gray-700"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-white flex items-center gap-2">
              <FaChartLine className="text-blue-400" />
              Bookings Overview
            </h3>
            <Link
              to="/dashboard/manage-slots"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
            >
              Manage slots
              <IoIosArrowForward size={18} />
            </Link>
          </div>
          <motion.div className="h-64" variants={chartVariants}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {bookingData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                    borderRadius: "0.375rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Weekly Schedule */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-gray-800 p-4 rounded-xl border border-gray-700"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-white flex items-center gap-2">
              <FaCalendarAlt className="text-lime-400" />
              Weekly Schedule
            </h3>
            <Link
              to="/dashboard/add-slot"
              className="text-lime-400 hover:text-lime-300 text-sm flex items-center gap-1"
            >
              Add slots
              <IoIosArrowForward size={18} />
            </Link>
          </div>
          <motion.div className="h-64" variants={chartVariants}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyScheduleData}>
                <XAxis
                  dataKey="day"
                  stroke="#6b7280"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="#6b7280"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                    borderRadius: "0.375rem",
                  }}
                />
                <Bar
                  dataKey="bookings"
                  fill="#a3e635"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-gray-800 p-4 rounded-xl border border-gray-700"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-white flex items-center gap-2">
              <FaClock className="text-purple-400" />
              Recent Bookings
            </h3>
            <Link
              to="/dashboard/manage-slots"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
            >
              View all
              <IoIosArrowForward size={18} />
            </Link>
          </div>
          <div className="space-y-3">
            {bookedSlots.length > 0 ? (
              bookedSlots.slice(0, 3).map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-400/10 p-2 rounded-lg">
                      {booking?.userImage ? (
                        <img
                          src={booking.userImage}
                          className="w-8 h-8 rounded-full"
                          alt="user image"
                        />
                      ) : (
                        <FaUser className="text-purple-400 text-sm" />
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {booking.userName}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {booking.slot.day} {booking.slot.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium text-sm">
                      {booking.price}
                    </p>
                    <p
                      className={`text-xs px-2 py-1 rounded-full ${
                        booking.paymentStatus === "paid"
                          ? "bg-emerald-400/10 text-emerald-400"
                          : "bg-amber-400/10 text-amber-400"
                      }`}
                    >
                      {booking.paymentStatus}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400">
                <p>No recent bookings</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-gray-800 p-4 rounded-xl border border-gray-700"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-white flex items-center gap-2">
              <MdFitnessCenter className="text-amber-400" />
              Your Skills
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  className="inline-block bg-amber-400/10 text-amber-400 text-xs px-3 py-1 rounded-full"
                >
                  {skill}
                </motion.span>
              ))
            ) : (
              <p className="text-gray-400">No skills listed</p>
            )}
          </div>
        </motion.div>

        {/* Upcoming Schedule */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-gray-800 p-4 rounded-xl border border-gray-700"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-white flex items-center gap-2">
              <FaCalendarAlt className="text-blue-400" />
              Upcoming Sessions
            </h3>
          </div>
          <div className="space-y-3">
            {bookedSlots.length > 0 ? (
              bookedSlots.slice(0, 3).map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <div className="bg-blue-400/10 p-2 rounded-lg">
                    <FaUser className="text-blue-400 text-sm" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {booking.slot.day} {booking.slot.time}
                    </p>
                    <p className="text-gray-400 text-xs">
                      With {booking.userName}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400">
                <p>No upcoming sessions</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-gray-800 p-4 rounded-xl border border-gray-700"
        >
          <h3 className="font-medium text-white flex items-center gap-2 mb-4">
            <GiWeightLiftingUp className="text-lime-400" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              to="/dashboard/add-slot"
              className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-lime-400/10 p-2 rounded-lg">
                    <MdFitnessCenter className="text-lime-400 text-sm" />
                  </div>
                  <span className="text-white text-sm">Add New Time Slot</span>
                </div>
                <IoIosArrowForward className="text-gray-400" />
              </div>
            </Link>
            <Link
              to="/dashboard/manage-slots"
              className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-400/10 p-2 rounded-lg">
                    <FaCalendarAlt className="text-blue-400 text-sm" />
                  </div>
                  <span className="text-white text-sm">Manage Bookings</span>
                </div>
                <IoIosArrowForward className="text-gray-400" />
              </div>
            </Link>
            <Link
              to="/dashboard/add-forum"
              className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-400/10 p-2 rounded-lg">
                    <FaUserTie className="text-purple-400 text-sm" />
                  </div>
                  <span className="text-white text-sm">Create Forum Post</span>
                </div>
                <IoIosArrowForward className="text-gray-400" />
              </div>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TrainerDashboardHome;
