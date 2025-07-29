/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaHistory,
  FaCalendarAlt,
  FaClock,
  FaUserAlt,
  FaChartPie,
  FaChartBar,
  FaArrowRight,
  FaBox,
} from "react-icons/fa";
import { FiTrendingUp, FiUserCheck, FiMail } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Shared/Loading";
import { fadeIn, staggerContainer } from "../../utils/motion";
import toastMessage from "../../utils/toastMessage";
import CustomHelmet from "../../Shared/CustomHelmet";

const COLORS = {
  primary: "#a3e635",
  secondary: "#3b82f6",
  accent: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
};

const Balance = () => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [paymentsRes, subscribersRes] = await Promise.all([
          axiosSecure.get("/admin/payment-summary"),
          axiosSecure.get("/newsletter"),
        ]);

        setPaymentData(paymentsRes.data);
        setSubscribers(subscribersRes.data);
      } catch (err) {
        setError(err.message);
        toastMessage("Failed to load dashboard data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700 max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">
            Failed to load data
          </h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-medium py-2 px-4 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  // Prepare chart data
  const chartData = [
    { name: "Paid Members", value: paymentData?.totalPaid || 0 },
    { name: "Subscribers", value: subscribers.length || 0 },
  ];

  // Format transactions for bar chart
  const barChartData = paymentData?.last6Transactions?.map((tx) => ({
    name: tx.trainer.split(" ")[0],
    amount: parseInt(tx.price.replace(/\D/g, "")),
    date: new Date(tx.paidAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    fullDate: new Date(tx.paidAt).toLocaleDateString(),
  }));

  return (
    <motion.div
      variants={staggerContainer(0.1, 0.3)}
      initial="hidden"
      animate="show"
      className="min-h-screen rounded-xl pb-12 pt-24 px-4 bg-gray-900"
    >
      <CustomHelmet
        title="FitForge - Financial Dashboard"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      <div className=" max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeIn("up", "tween", 0.2, 1)}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="bg-lime-400/20 p-2 rounded-lg">
                <FiTrendingUp className="text-lime-400 text-2xl" />
              </span>
              <span>Financial Dashboard</span>
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Overview of revenue, memberships, and transactions
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 flex items-center gap-2 shadow-md"
          >
            <FaHistory className="text-lime-400 text-sm" />
            <span className="text-white font-medium text-sm">
              Last {paymentData?.last6Transactions?.length || 0} Transactions
            </span>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={fadeIn("up", "tween", 0.3, 1)}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-xl p-6 border border-gray-700 shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div className="bg-lime-400/10 p-3 rounded-lg shadow-inner">
                <FaDollarSign className="text-lime-400 text-2xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Balance
                </p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  ${paymentData?.totalPaid?.toLocaleString() || 0}
                </h3>
                <p className="text-gray-400 text-xs mt-1">All-time revenue</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-xl p-6 border border-gray-700 shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-400/10 p-3 rounded-lg shadow-inner">
                <FiUserCheck className="text-blue-400 text-2xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Paid Members
                </p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {paymentData?.last6Transactions?.length || 0}
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  Active subscriptions
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-xl p-6 border border-gray-700 shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-400/10 p-3 rounded-lg shadow-inner">
                <FiMail className="text-purple-400 text-2xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Newsletter Subscribers
                </p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {subscribers.length || 0}
                </h3>
                <p className="text-gray-400 text-xs mt-1">Engaged audience</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          variants={fadeIn("up", "tween", 0.4, 1)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Pie Chart */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-xl p-6 border border-gray-700 shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FaChartPie className="text-lime-400" />
                Members vs Subscribers
              </h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-700 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-lime-400"></span>
                  Paid Members
                </span>
                <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-700 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  Subscribers
                </span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? COLORS.primary : COLORS.accent}
                        stroke="#1f2937"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `${value}`,
                      value === paymentData?.totalPaid
                        ? "Paid Members"
                        : "Subscribers",
                    ]}
                    contentStyle={{
                      backgroundColor: "#111827",
                      borderColor: "#374151",
                      borderRadius: "0.375rem",
                      padding: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    itemStyle={{
                      color: "#f3f4f6",
                      fontSize: "0.875rem",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      paddingTop: "20px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-xl p-6 border border-gray-700 shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FaChartBar className="text-lime-400" />
                Revenue Overview
              </h3>
              <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                Last {paymentData?.last6Transactions?.length || 0} payments
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{
                    top: 5,
                    right: 20,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tickFormatter={(value) => `$${value}`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      borderColor: "#374151",
                      borderRadius: "0.375rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value) => [`$${value}`, "Amount"]}
                    labelFormatter={(label) => {
                      const tx = barChartData.find((d) => d.date === label);
                      return tx ? `Date: ${tx.fullDate}` : label;
                    }}
                    cursor={{ fill: "#374151" }}
                  />
                  <Bar
                    dataKey="amount"
                    fill={COLORS.primary}
                    name="Payment Amount"
                    radius={[4, 4, 0, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          variants={fadeIn("up", "tween", 0.5, 1)}
          className="bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-xl border border-gray-700 shadow-lg overflow-hidden backdrop-blur-sm"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FaHistory className="text-lime-400" />
              Recent Transactions
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaUserAlt className="text-lime-400 text-xs" />
                      Member
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaUserAlt className="text-blue-400 text-xs" />
                      Trainer
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-purple-400 text-xs" />
                      Session
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaBox className="text-lime-400 text-xs" />
                      Package
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-green-400 text-xs" />
                      Amount
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-yellow-400 text-xs" />
                      Date
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {paymentData?.last6Transactions?.map((transaction, index) => (
                  <motion.tr
                    key={transaction._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center border-2 border-lime-400/30 overflow-hidden">
                          {transaction?.userImage ? (
                            <img
                              src={transaction.userImage}
                              alt={`${transaction.userName} photo`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaUserAlt className="text-gray-300" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {transaction.userName}
                          </div>
                          <div className="text-xs text-gray-400">
                            {transaction.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {transaction.trainer}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white">
                          {transaction.slot.day}
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-700 px-1.5 py-0.5 rounded">
                          {transaction.slot.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/20">
                        {transaction.package}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      <span className="bg-gray-700/50 px-2 py-1 rounded">
                        {transaction.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(transaction.paidAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Balance;
