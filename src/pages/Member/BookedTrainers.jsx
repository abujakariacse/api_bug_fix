/* eslint-disable no-unused-vars */
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Shared/Loading";
import {
  FaUserTie,
  FaDumbbell,
  FaRegStar,
  FaStar,
  FaClipboardList,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaChalkboardTeacher,
  FaUsers,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router";
import useAuth from "../../Hooks/useAuth";
import BookedTrainerCard from "../../components/BookedTrainerCard";
import ReviewModal from "../../components/ReviewModal";
import toastMessage from "../../utils/toastMessage";
import CustomHelmet from "../../Shared/CustomHelmet";

const BookedTrainers = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch member data
  const {
    data: memberData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["member-booked-trainers"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/activity?email=${user.email}`);
      return res.data;
    },
  });
  // Get booked trainers with paymentStatus 'paid'
  const bookedTrainers = useMemo(
    () =>
      memberData?.activityLog?.paymentHistory
        ?.filter((booking) => booking.paymentStatus === "paid")
        .map((booking) => ({
          ...booking,
          trainerImage: booking.trainerImage,
        })) || [],
    [memberData]
  );

  // Extract unique skills from booked trainers
  const uniqueSkills = useMemo(() => {
    if (!bookedTrainers.length) return [];
    return [
      ...new Set(bookedTrainers.flatMap((trainer) => trainer.trainerSkills)),
    ];
  }, [bookedTrainers]);

  // Fetch classes by skills
  const { data: classesData, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["classes-by-skills", uniqueSkills],
    queryFn: async () => {
      if (!uniqueSkills.length) return [];
      const res = await axiosSecure.get(
        `/classes/by-skills?skills=${uniqueSkills.join(",")}`
      );
      return res.data.data || [];
    },
    enabled: uniqueSkills.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews-by-userId"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews?email=${user.email}`);
      return res.data;
    },
  });

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!selectedTrainer || !rating || !reviewText.trim()) return;

    const reviewData = {
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
      rating,
      reviewDescription: reviewText.trim(),
      createdAt: new Date(),
    };

    setIsSubmitting(true);

    try {
      // Optional fake delay (simulate loading)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const res = await axiosSecure.post("/reviews", reviewData);

      if (res.data.insertedId) {
        toastMessage("Thank you for your review!", "success");
        // Reset form only on success
        setReviewText("");
        setRating(0);
        setSelectedTrainer(null);
      } else {
        toastMessage("Failed to submit review", "error");
      }
    } catch (err) {
      toastMessage("Failed to submit review", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 text-center mt-8"
      >
        Failed to load booked trainers
      </motion.div>
    );
  }

  return (
    <div className="rounded-xl mx-auto px-4 py-8 bg-gray-900">
      <CustomHelmet
        title="FitForge - Booked Trainers"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      {/* Header */}
      <div className="text-center mb-12 pt-6">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-lime-400 mb-4 flex items-center justify-center gap-3"
        >
          <FaUserTie className="text-lime-400 text-4xl" />
          Your Booked Trainers
        </motion.h1>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-400 max-w-2xl mx-auto"
        >
          View all trainers you've booked sessions with
        </motion.p>
      </div>

      {/* Stats Summary */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
      >
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-lime-900/50 p-3 rounded-lg border border-lime-400/30">
              <FaUserTie className="text-lime-400 text-2xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Booked</p>
              <p className="text-3xl font-bold text-lime-400">
                {bookedTrainers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-lime-900/50 p-3 rounded-lg border border-lime-400/30">
              <FaDumbbell className="text-lime-400 text-2xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Upcoming Sessions</p>
              <p className="text-3xl font-bold text-lime-400">
                {bookedTrainers.length > 0 ? bookedTrainers.length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-lime-900/50 p-3 rounded-lg border border-lime-400/30">
              <FaClipboardList className="text-lime-400 text-2xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Reviews Given</p>
              <p className="text-3xl font-bold text-lime-400">
                {reviews.length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trainers List */}
      {bookedTrainers.length > 0 ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12"
        >
          {bookedTrainers.map((trainer, index) => (
            <BookedTrainerCard
              key={trainer._id}
              trainer={trainer}
              classesData={classesData}
              isLoadingClasses={isLoadingClasses}
              setSelectedTrainer={setSelectedTrainer}
              index={index}
            />
          ))}
        </motion.div>
      ) : (
        <EmptyTrainersState />
      )}

      {/* Review Modal */}
      {selectedTrainer && (
        <ReviewModal
          selectedTrainer={selectedTrainer}
          rating={rating}
          setRating={setRating}
          reviewText={reviewText}
          setReviewText={setReviewText}
          isSubmitting={isSubmitting}
          isLoadingReviews={isLoadingReviews}
          onClose={() => {
            setSelectedTrainer(null);
            setReviewText("");
            setRating(0);
          }}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

// Empty State Component
const EmptyTrainersState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700"
  >
    <div className="max-w-md mx-auto">
      <div className="bg-lime-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-lime-400/30">
        <FaUserTie className="text-lime-400 text-3xl" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">
        No Trainers Booked Yet
      </h3>
      <p className="text-gray-400 mb-6">
        Browse our certified trainers and book your first session!
      </p>
      <Link
        to="/trainers"
        className="inline-block bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-medium py-3 px-6 rounded-lg transition shadow-lg shadow-lime-500/20"
      >
        Browse Trainers
      </Link>
    </div>
  </motion.div>
);

export default BookedTrainers;
