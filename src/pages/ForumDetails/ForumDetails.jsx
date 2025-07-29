/* eslint-disable no-unused-vars */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaCrown,
  FaDumbbell,
  FaArrowLeft,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import toastMessage from "../../utils/toastMessage";
import Loading from "../../Shared/Loading";
import { formatDistanceToNow } from "date-fns";
import CustomHelmet from "../../Shared/CustomHelmet";

const ForumDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [hasVoted, setHasVoted] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const email = user.email;

  // Fetch forum details
  const {
    data: forum = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["forum", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/forums/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (forum?.likes) {
      setLikesCount(forum.likes.length);
      if (user) {
        setHasVoted(forum.likes.includes(user.email));
      }
    }
  }, [forum, user]);

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: (voteType) =>
      axiosSecure.patch(`/forum/vote/${id}`, {
        voteType,
        email,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["forum", id]);
      setLikesCount(data.data.likesCount);
      setHasVoted(data.data.hasVoted);
      toastMessage("Vote recorded successfully", "success");
    },
    onError: (error) => {
      error && toastMessage("Vote failed", "error");
    },
  });

  const handleVote = (voteType) => {
    if (!user) {
      toastMessage("Please login to vote!", "error");
      return;
    }
    voteMutation.mutate(voteType);
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center py-12 text-red-500">
        Error: {error.message}
      </div>
    );

  const timeAgo = formatDistanceToNow(new Date(forum.createdAt), {
    addSuffix: true,
  });

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 pb-12 pt-24"
    >
      <CustomHelmet
        title="FitForge - Forum Details"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ x: -3 }}
        className="flex items-center gap-2 text-lime-400 mb-6"
      >
        <FaArrowLeft /> Back to Home
      </motion.button>

      {/* Main Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700"
      >
        {/* Author Section */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <img
                src={forum.userPhotoURL}
                alt={forum.userName}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
              />
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-white truncate text-lg">
                  {forum.userName}
                </h2>
                {forum.role === "admin" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300">
                    <FaCrown className="mr-1" /> Admin
                  </span>
                )}
                {forum.role === "trainer" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
                    <FaDumbbell className="mr-1" /> Trainer
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm">Posted {timeAgo}</p>
            </div>
          </div>

          {/* Title & Description */}
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-white mb-4"
            whileHover={{ color: "#a3e635" }}
          >
            {forum.forumTitle}
          </motion.h1>
          <p className="text-gray-300 whitespace-pre-line">
            {forum.forumDescription}
          </p>
        </div>

        {/* Image */}
        {forum.imageUrl && (
          <motion.div className="relative overflow-hidden">
            <motion.img
              src={forum.imageUrl}
              alt="Forum content"
              className="w-full max-h-[500px] object-contain bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
          </motion.div>
        )}

        {/* Voting Section */}
        <div className="p-4 border-t border-gray-700 flex items-center gap-4">
          <motion.button
            onClick={() => handleVote("up")}
            disabled={voteMutation.isLoading || hasVoted}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              hasVoted
                ? "bg-lime-400/20 text-lime-400"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            }`}
          >
            <FaThumbsUp className="text-lg" />
            <span className="font-medium">{likesCount}</span>
          </motion.button>

          <motion.button
            onClick={() => handleVote("down")}
            disabled={voteMutation.isLoading || !hasVoted}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              !hasVoted
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-300 hover:text-red-400"
            }`}
          >
            <FaThumbsDown className="text-lg" />
            <span className="font-medium">Remove vote</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default ForumDetails;
