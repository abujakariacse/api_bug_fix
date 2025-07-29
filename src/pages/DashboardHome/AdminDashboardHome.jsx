/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Shared/Loading";
import {
  FaUserTie,
  FaDollarSign,
  FaChartLine,
  FaCalendarAlt,
  FaEnvelope,
} from "react-icons/fa";
import { MdFitnessCenter } from "react-icons/md";
import { GiWeightLiftingUp } from "react-icons/gi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router";
import StatCard from "../../components/StatCard";
import { motion } from "framer-motion";
import { IoIosArrowForward } from "react-icons/io";
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

const AdminDashboardHome = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch all dashboard data in parallel
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const [subscribersRes, trainersRes, paymentsRes] = await Promise.all([
        axiosSecure.get("/newsletter"),
        axiosSecure.get("/users/trainers"),
        axiosSecure.get("/admin/payment-summary"),
      ]);

      return {
        subscribers: subscribersRes.data,
        trainers: trainersRes.data,
        payments: paymentsRes.data,
      };
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

  // Prepare data for charts
  const activityData = [
    { name: "Subscribers", value: dashboardData.subscribers.length },
    { name: "Trainers", value: dashboardData.trainers.length },
  ];

  const recentTransactions =
    dashboardData.payments?.last6Transactions?.slice(0, 3) || [];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 sm:p-6 bg-gray-900 rounded-xl space-y-6"
    >
      <CustomHelmet
        title="FitForge - Admin Dashboard"
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
            <MdFitnessCenter className="text-lime-400 text-3xl" />
            Fitness Admin Dashboard
          </motion.h1>
          <motion.p
            className="text-gray-400 mt-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Overview of your fitness platform's performance
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

      {/* Compact Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<FaEnvelope className="text-lime-400 text-xl" />}
            title="Subscribers"
            value={dashboardData.subscribers.length}
            description="Fitness enthusiasts"
            color="lime"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<GiWeightLiftingUp className="text-blue-400 text-xl" />}
            title="Trainers"
            value={dashboardData.trainers.length}
            description="Certified professionals"
            color="blue"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<FaDollarSign className="text-amber-400 text-xl" />}
            title="Revenue"
            value={`$${
              dashboardData.payments?.totalPaid?.toLocaleString() || 0
            }`}
            description="All-time earnings"
            color="amber"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<FaUserTie className="text-purple-400 text-xl" />}
            title="Avg. Sessions"
            value={
              dashboardData.payments?.last6Transactions?.length > 0
                ? Math.round(
                    dashboardData.payments.last6Transactions.length /
                      dashboardData.trainers.length
                  )
                : 0
            }
            description="Per trainer"
            color="purple"
          />
        </motion.div>
      </motion.div>

      {/* Improved Compact Activity Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {/* Mini Activity Chart */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-gray-800 p-4 rounded-xl border border-gray-700"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-medium text-white flex items-center gap-2">
              <FaChartLine className="text-lime-400" />
              Activity Overview
            </h3>
            <span className="text-xs text-gray-400">Last 30 days</span>
          </div>
          <motion.div className="h-40" variants={chartVariants}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <XAxis
                  dataKey="name"
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
                  dataKey="value"
                  fill="#a3e635"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Compact Transactions */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-gray-800 p-4 rounded-xl border border-gray-700"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-white flex items-center gap-2">
              <FaDollarSign className="text-blue-400" />
              Recent Transactions
            </h3>
            <Link
              to="/dashboard/balance"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
            >
              View all
              <IoIosArrowForward size={18} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx, index) => (
                <motion.div
                  key={tx._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-400/10 p-2 rounded-lg">
                      <FaDollarSign className="text-blue-400 text-sm" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {tx.userName}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(tx.paidAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium text-sm">
                      ${tx.price}
                    </p>
                    <p className="text-gray-400 text-xs">{tx.trainer}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400">
                <p>No recent transactions</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Trainer Performance */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-gray-800 p-4 rounded-xl border border-gray-700"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-white flex items-center gap-2">
              <GiWeightLiftingUp className="text-purple-400" />
              Top Trainers
            </h3>
            <Link
              to="/dashboard/allTrainers"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
            >
              View all trainers
              <IoIosArrowForward size={18} />
            </Link>
          </div>

          <div className="space-y-3">
            {dashboardData.trainers.slice(0, 3).map((trainer, index) => (
              <motion.div
                key={trainer._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-purple-400/10 p-2 rounded-lg">
                    <FaUserTie className="text-purple-400 text-sm" />
                  </div>
                  <p className="text-white text-sm">{trainer.name}</p>
                </div>
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  {trainer.specialization || "General"}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Subscribers */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-gray-800 p-4 rounded-xl border border-gray-700"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-white flex items-center gap-2">
              <FaEnvelope className="text-lime-400" />
              New Subscribers
            </h3>
            <Link
              to="/dashboard/subscribers"
              className="text-lime-400 hover:text-lime-300 text-sm flex items-center gap-1"
            >
              View all subscribers
              <IoIosArrowForward size={18} />
            </Link>
          </div>

          <div className="space-y-3">
            {dashboardData.subscribers.slice(0, 3).map((sub, index) => (
              <motion.div
                key={sub._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-lime-400/10 p-2 rounded-lg">
                    <FaEnvelope className="text-lime-400 text-sm" />
                  </div>
                  <p className="text-white text-sm">{sub.email}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(sub.subscribedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboardHome;
