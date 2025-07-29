/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { Link } from "react-router";

const PaymentSuccess = ({ bookingDetails, onClose }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center border border-lime-400/20 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        aria-label="Close modal"
      >
        <FaTimes className="text-xl" />
      </button>

      <FaCheckCircle className="text-lime-400 text-5xl mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">
        Payment Successful!
      </h2>
      <p className="text-gray-300 mb-6">
        Your booking with{" "}
        <span className="text-lime-400">{bookingDetails.trainer}</span> on{" "}
        {bookingDetails.day} at {bookingDetails.time} is confirmed.
      </p>

      <div className="space-y-4 mb-6 text-left bg-gray-700 p-4 rounded-lg">
        <p className="text-white">
          <span className="text-gray-400">Transaction ID:</span>{" "}
          {bookingDetails.transactionId}
        </p>
        <p className="text-white">
          <span className="text-gray-400">Package:</span>{" "}
          {bookingDetails.packageName}
        </p>
        <p className="text-white">
          <span className="text-gray-400">Amount:</span> {bookingDetails.price}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/dashboard/activityLog"
          className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-medium py-2 px-4 rounded text-center"
        >
          View Payment History
        </Link>
        <Link
          to="/trainers"
          className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded text-center"
        >
          Book Another Session
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
