/* eslint-disable no-unused-vars */
import { useMutation } from "@tanstack/react-query";
import { FaThumbsUp, FaThumbsDown, FaCrown, FaDumbbell } from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toastMessage from "../../utils/toastMessage";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const ForumCard = ({ forum, user, queryClient, page }) => {
  const axiosSecure = useAxiosSecure();
  const [hasVoted, setHasVoted] = useState(false);
  const [likesCount, setLikesCount] = useState(forum.likes?.length || 0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (user && Array.isArray(forum.likes)) {
      setHasVoted(forum.likes.includes(user.email));
    }
    setLikesCount(forum.likes?.length || 0);
  }, [forum.likes, user]);

  const voteMutation = useMutation({
    mutationFn: ({ forumId, voteType }) =>
      axiosSecure.patch(`/forum/vote/${forumId}`, {
        voteType,
        email: user?.email,
      }),
    onMutate: async ({ forumId, voteType }) => {
      await queryClient.cancelQueries(["forums", page]);

      const previousForums = queryClient.getQueryData(["forums", page]);

      queryClient.setQueryData(["forums", page], (old) => ({
        ...old,
        forums: old.forums.map((f) => {
          if (f._id === forumId) {
            const newLikes = Array.isArray(f.likes) ? [...f.likes] : [];
            if (voteType === "up") {
              newLikes.push(user.email);
            } else {
              const index = newLikes.indexOf(user.email);
              if (index !== -1) {
                newLikes.splice(index, 1);
              }
            }
            return { ...f, likes: newLikes };
          }
          return f;
        }),
      }));

      return { previousForums };
    },
    onError: (err, variables, context) => {
      toastMessage(err.response?.data?.message || "Vote failed", "error");
      queryClient.setQueryData(["forums", page], context.previousForums);
    },
    onSuccess: (data) => {
      setLikesCount(data.data.likesCount);
      setHasVoted(data.data.likes.includes(user.email));
      toastMessage(
        data.data.message || "Vote recorded successfully",
        "success"
      );
    },
  });

  const handleVote = (forumId, voteType) => {
    if (!user) {
      toastMessage("Please login to vote!", "error");
      return;
    }
    voteMutation.mutate({ forumId, voteType });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-lime-400/30 transition-all"
    >
      {/* Author Section */}
      <div className="p-5 pb-0">
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }}>
            <img
              src={forum.userPhotoURL}
              alt={forum.userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
            />
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white truncate">
                {forum.userName}
              </h2>
              {forum.role === "admin" && (
                <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300">
                  <FaCrown className="mr-1" /> Admin
                </span>
              )}
              {forum.role === "trainer" && (
                <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
                  <FaDumbbell className="mr-1" /> Trainer
                </span>
              )}
            </div>
            <p className="text-gray-400 text-xs">
              {formatDistanceToNow(new Date(forum.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 pt-3">
        <motion.h3
          className="text-xl font-bold text-white mb-2"
          whileHover={{ color: "#a3e635" }}
        >
          {forum.forumTitle}
        </motion.h3>
        <p className="text-gray-300 mb-4 line-clamp-2">
          {forum.forumDescription}
        </p>
      </div>

      {/* Image Section */}
      {forum.imageUrl && (
        <motion.div className="relative overflow-hidden">
          <motion.img
            src={forum.imageUrl}
            alt="Forum content"
            className="w-full h-48 object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>
      )}

      {/* Actions Section */}
      <div className="p-4 border-t border-gray-700 flex items-center justify-between">
        <motion.button
          onClick={() => handleVote(forum._id, "up")}
          disabled={voteMutation.isLoading || hasVoted}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
            hasVoted
              ? "bg-lime-400/20 text-lime-400"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
        >
          <FaThumbsUp className="text-sm" />
          <span className="text-sm font-medium">{likesCount}</span>
        </motion.button>

        <motion.button
          onClick={() => handleVote(forum._id, "down")}
          disabled={voteMutation.isLoading || !hasVoted}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
            !hasVoted
              ? "text-gray-500 cursor-not-allowed"
              : "text-gray-300 hover:text-red-400"
          }`}
        >
          <FaThumbsDown className="text-sm" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ForumCard;
