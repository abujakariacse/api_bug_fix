/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Shared/Loading";
import ForumPagination from "./ForumPagination";
import ForumCard from "./ForumCard";
import { motion } from "framer-motion";
import CustomHelmet from "../../Shared/CustomHelmet";

const AllForums = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const {
    data: forumsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["forums", page],
    queryFn: () =>
      axiosSecure
        .get(`/forums?page=${page}&pageSize=${pageSize}`)
        .then((res) => res.data),
  });

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center py-24 text-red-500">Error loading forums</div>
    );

  const { forums, total } = forumsData;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-7xl mx-auto pt-24 px-4 pb-12">
      <CustomHelmet
        title="FitForge - Community"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
          Community Forums
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Insights and discussions from our trainers and admin team
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {forums.map((forum) => (
          <ForumCard
            key={forum._id}
            forum={forum}
            user={user}
            queryClient={queryClient}
            page={page}
          />
        ))}
      </motion.div>

      <ForumPagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default AllForums;
