/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaStar, FaQuoteLeft } from "react-icons/fa";
import Loading from "../../Shared/Loading";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const ReviewsCarousel = () => {
  const axiosSecure = useAxiosSecure();
  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews-by-userId"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews`);
      return res.data;
    },
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);

  // Handle responsive card count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCardsPerView(1);
      else if (window.innerWidth < 1024) setCardsPerView(2);
      else setCardsPerView(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-rotation with pause on hover
  useEffect(() => {
    if (!isAutoRotating || reviews.length <= cardsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + cardsPerView >= reviews.length ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRotating, reviews.length, cardsPerView]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      prev + cardsPerView >= reviews.length ? 0 : prev + 1
    );
  }, [cardsPerView, reviews.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, reviews.length - cardsPerView) : prev - 1
    );
  }, [cardsPerView, reviews.length]);

  // Touch swipe handling
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      else if (e.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Memoized visible reviews
  const visibleReviews = useMemo(() => {
    const start = currentIndex;
    let end = currentIndex + cardsPerView;

    // Handle looping
    if (end > reviews.length) {
      const overflow = end - reviews.length;
      return [...reviews.slice(start), ...reviews.slice(0, overflow)];
    }
    return reviews.slice(start, end);
  }, [currentIndex, cardsPerView, reviews]);

  if (isLoadingReviews) {
    return <Loading />;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-300">
        No reviews yet. Be the first to share your experience!
      </div>
    );
  }

  return (
    <motion.section
      className="relative pb-16 px-4 xl:px-0 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      onMouseEnter={() => setIsAutoRotating(false)}
      onMouseLeave={() => setIsAutoRotating(true)}
    >
      {/* Section Header */}
      <div className="text-center mb-10">
        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            duration: 0.8,
          }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold pb-4 bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent"
        >
          What Our Members Say
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: "easeOut",
          }}
          viewport={{ once: true }}
          className="text-gray-300 max-w-2xl mx-auto"
        >
          Hear from our community about their fitness journey experiences
        </motion.p>
      </div>

      {/* Reviews Carousel */}
      <div
        className="relative mx-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Arrows - Only show if needed */}
        {reviews.length > cardsPerView && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-gray-900/80 backdrop-blur-md border border-lime-400/30 text-lime-400 hover:bg-lime-400/20 transition-all shadow-lg -translate-x-1/2 hover:scale-110"
              aria-label="Previous reviews"
            >
              <FaArrowLeft className="text-xl" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-gray-900/80 backdrop-blur-md border border-lime-400/30 text-lime-400 hover:bg-lime-400/20 transition-all shadow-lg translate-x-1/2 hover:scale-110"
              aria-label="Next reviews"
            >
              <FaArrowRight className="text-xl" />
            </button>
          </>
        )}

        {/* Reviews Container */}
        <div className="overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2"
            >
              {visibleReviews.map((review) => (
                <motion.div
                  key={review._id}
                  layout
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 40px rgba(163, 230, 53, 0.15)",
                    borderColor: "rgba(163, 230, 53, 0.5)",
                  }}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-800 shadow-xl h-full flex flex-col group"
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-5">
                      <div className="relative">
                        <div className="absolute -top-2 z-40 -left-2 w-8 h-8 rounded-full bg-lime-400/20 flex items-center justify-center group-hover:bg-lime-400/30 transition-colors">
                          <FaQuoteLeft className="text-lime-400 text-xs" />
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-lime-400/20 blur-sm group-hover:blur-md transition-all duration-500"></div>
                          <img
                            src={review.photoURL || "/default-avatar.jpg"}
                            alt={review.displayName}
                            className="relative w-14 h-14 rounded-full object-cover border-2 border-lime-400/50 z-10"
                            onError={(e) => {
                              e.target.src = "/default-avatar.jpg";
                            }}
                          />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-gray-100">
                          {review.displayName}
                        </h3>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              whileHover={{ scale: 1.2 }}
                              className="mr-1"
                            >
                              <FaStar
                                className={`text-sm ${
                                  i < review.rating
                                    ? "text-amber-400"
                                    : "text-gray-600"
                                }`}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <motion.p
                      className="text-gray-300 pl-2 border-l-2 border-lime-400/50 group-hover:border-lime-400 transition-colors"
                      initial={{ opacity: 0.8 }}
                      whileInView={{ opacity: 1 }}
                    >
                      "{review.reviewDescription}"
                    </motion.p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                          className="w-1.5 h-1.5 rounded-full bg-lime-400"
                        />
                      ))}
                    </div>

                    {review.createdAt && (
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination Dots - Only show if needed */}
      {reviews.length > cardsPerView && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({
            length: Math.ceil(reviews.length / cardsPerView),
          }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index * cardsPerView)}
              whileHover={{ scale: 1.3 }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                Math.floor(currentIndex / cardsPerView) === index
                  ? "bg-lime-400 scale-125"
                  : "bg-gray-700"
              }`}
              aria-label={`Go to review set ${index + 1}`}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default ReviewsCarousel;
