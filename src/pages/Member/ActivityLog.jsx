/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Shared/Loading";
import {
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUserPlus,
  FaSignInAlt,
  FaDollarSign,
  FaCalendarCheck,
  FaCalendarTimes,
} from "react-icons/fa";
import { format } from "date-fns";
import Modal from "../../components/Modal";
import useAuth from "../../Hooks/useAuth";
import { motion } from "framer-motion";
import CustomHelmet from "../../Shared/CustomHelmet";

const ActivityLog = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: userData = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userActivity", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/activity?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-center text-red-500">
        Error loading activity log: {error.message}
      </div>
    );

  const { activityLog, trainerApplication } = userData;

  const openFeedbackModal = () => {
    setSelectedFeedback(trainerApplication?.feedback);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <CustomHelmet
        title="FitForge - Activity Log"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-lime-400 mb-8 text-center"
        >
          Activity Log
        </motion.h1>

        {/* Account Activity Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FaUserPlus className="text-lime-400" /> Account Activity
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <span className="text-gray-300">Account Created</span>
              <span className="text-white">
                {activityLog?.createdAt
                  ? format(
                      new Date(activityLog.createdAt),
                      "MMM dd, yyyy hh:mm a"
                    )
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <span className="text-gray-300">Last Login</span>
              <span className="text-white">
                {activityLog?.lastLogin
                  ? format(
                      new Date(activityLog.lastLogin),
                      "MMM dd, yyyy hh:mm a"
                    )
                  : "N/A"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Trainer Application Status */}
        {trainerApplication && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Trainer Application Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div>
                  <h3 className="text-gray-400">Application Date</h3>
                  <p className="text-white">
                    {trainerApplication.createdAt
                      ? format(
                          new Date(trainerApplication.createdAt),
                          "MMM dd, yyyy hh:mm a"
                        )
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-400">Last Updated</h3>
                  <p className="text-white">
                    {trainerApplication.updatedAt
                      ? format(
                          new Date(trainerApplication.updatedAt),
                          "MMM dd, yyyy hh:mm a"
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-gray-400">Status</h3>
                  <div className="flex items-center gap-2">
                    {trainerApplication.status === "pending" && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <FaClock /> Pending Review
                      </span>
                    )}
                    {trainerApplication.status === "approved" && (
                      <span className="flex items-center gap-1 text-lime-400">
                        <FaCheckCircle /> Approved
                      </span>
                    )}
                    {trainerApplication.status === "rejected" && (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-red-400">
                          <FaTimesCircle /> Rejected
                        </span>
                        {trainerApplication.feedback && (
                          <button
                            onClick={openFeedbackModal}
                            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <FaEye /> View Feedback
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment History */}
        {activityLog?.paymentHistory?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaSignInAlt className="text-lime-400" /> Payment History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Trainer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {activityLog.paymentHistory.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={
                                payment.trainerImage || "/default-avatar.jpg"
                              }
                              alt={payment.trainer}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {payment.trainer}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {payment.slot.day}
                        </div>
                        <div className="text-sm text-gray-300">
                          {payment.slot.time}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {payment.package}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {payment.price}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {payment.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Feedback Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-lime-400">
                Application Feedback
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
              {selectedFeedback ? (
                <p className="text-gray-300 whitespace-pre-line">
                  {selectedFeedback}
                </p>
              ) : (
                <p className="text-gray-400 italic">
                  No feedback was provided.
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-gray-900 font-medium rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ActivityLog;
