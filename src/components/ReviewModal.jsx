/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaRegStar, FaStar } from "react-icons/fa";
import Loading from "../Shared/Loading";
const ReviewModal = ({
  selectedTrainer,
  rating,
  setRating,
  reviewText,
  setReviewText,
  isSubmitting,
  onClose,
  onSubmit,
  isLoadingReviews,
}) => {
  if (isLoadingReviews) {
    return <Loading></Loading>;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl w-full max-w-md p-6 border border-gray-700"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-lime-400">
            Review {selectedTrainer.trainer}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            &times;
          </button>
        </div>

        <div className="flex items-center mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <img
            src={selectedTrainer.trainerImage}
            alt={selectedTrainer.trainer}
            className="w-12 h-12 rounded-full object-cover border-2 border-lime-500/50 mr-3"
          />
          <div>
            <h4 className="font-semibold text-white">
              {selectedTrainer.trainer}
            </h4>
            <p className="text-gray-400 text-sm">{selectedTrainer.package}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-3xl mx-1 focus:outline-none transition transform hover:scale-110"
              >
                {star <= rating ? (
                  <FaStar className="text-amber-400" />
                ) : (
                  <FaRegStar className="text-gray-500" />
                )}
              </button>
            ))}
          </div>

          <div className="text-center mb-2">
            <span className="text-sm text-gray-400">
              {rating === 0
                ? "Select your rating"
                : rating === 1
                ? "Poor"
                : rating === 2
                ? "Fair"
                : rating === 3
                ? "Good"
                : rating === 4
                ? "Very Good"
                : "Excellent"}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="review"
            className="block text-gray-300 font-medium mb-2"
          >
            Your Review
          </label>
          <textarea
            id="review"
            rows="4"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this trainer..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent text-white placeholder-gray-500"
          ></textarea>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={rating === 0 || !reviewText.trim() || isSubmitting}
            className={`flex-1 text-white font-medium py-3 rounded-lg transition ${
              rating === 0 || !reviewText.trim() || isSubmitting
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewModal;
