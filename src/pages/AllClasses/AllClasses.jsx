/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Pagination from "./Pagination";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import Loading from "../../Shared/Loading";
import ClassCard from "../../components/ClassCard";
import NoClass from "../../components/NoClass";
import { motion, AnimatePresence } from "framer-motion";
import CustomHelmet from "../../Shared/CustomHelmet";

// Simplified animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hover: {
    y: -3,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const filterVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const AllClasses = () => {
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    difficulty: "",
    skill: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const classesPerPage = 6;

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 800);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // First query to get all classes for filter options
  const { data: allClasses = [] } = useQuery({
    queryKey: ["all-classes"],
    queryFn: async () => {
      const res = await axiosSecure.get("/classes/all");
      return res.data;
    },
  });

  // Main query for paginated results
  const {
    data: classesData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["classes", currentPage, debouncedSearchTerm, filters],
    queryFn: async () => {
      const res = await axiosSecure.get("/classes", {
        params: {
          search: debouncedSearchTerm,
          page: currentPage,
          limit: classesPerPage,
          difficulty: filters.difficulty,
          skill: filters.skill,
        },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  // Extract unique difficulty levels from all classes
  const difficultyOptions = [
    { value: "", label: "All Levels" },
    ...Array.from(
      new Set(allClasses.map((classItem) => classItem.difficultyLevel))
    )
      .filter(Boolean)
      .map((difficulty) => ({
        value: difficulty,
        label: difficulty,
      })),
  ];

  // Extract unique skills from all classes
  const skillOptions = [
    { value: "", label: "All Skills" },
    ...Array.from(new Set(allClasses.flatMap((classItem) => classItem.skills)))
      .filter(Boolean)
      .map((skill) => ({
        value: skill,
        label: skill.charAt(0).toUpperCase() + skill.slice(1),
      })),
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setFilters({
      difficulty: "",
      skill: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
    setShowFilters(false);
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-24 text-red-500"
      >
        Error loading classes
      </motion.div>
    );

  return (
    <div className="max-w-7xl mx-auto pt-24 px-4 pb-12">
      <CustomHelmet
        title="FitForge - Classes"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
          All Fitness Classes
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover our comprehensive collection of fitness classes tailored to
          all skill levels and interests
        </p>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent text-gray-300 transition-all"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters
                ? "bg-lime-500 text-gray-900"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
          >
            {showFilters ? <FaTimes /> : <FaFilter />}
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Dropdown */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              variants={filterVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-4 bg-gray-800 rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Difficulty Level
                    </label>
                    <select
                      name="difficulty"
                      value={filters.difficulty}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                    >
                      {difficultyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Skill Focus
                    </label>
                    <select
                      name="skill"
                      value={filters.skill}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                    >
                      {skillOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-4">
                  <button
                    onClick={resetAllFilters}
                    className="px-4 py-2 text-gray-300 hover:text-lime-400 transition-colors flex items-center gap-2"
                  >
                    <FaTimes />
                    Reset All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Classes Grid */}
      {classesData.data?.length > 0 ? (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {classesData.data.map((classItem) => (
              <motion.div
                key={classItem._id}
                variants={cardVariants}
                whileHover="hover"
                className="transition-shadow duration-300 hover:shadow-lg hover:shadow-lime-400/20"
              >
                <ClassCard classItem={classItem} />
              </motion.div>
            ))}
          </motion.div>

          <Pagination
            itemsPerPage={classesPerPage}
            totalItems={classesData.pagination?.total || 0}
            currentPage={currentPage}
            paginate={setCurrentPage}
          />
        </>
      ) : (
        <NoClass
          hasFilters={!!(searchTerm || filters.difficulty || filters.skill)}
          onReset={resetAllFilters}
        />
      )}
    </div>
  );
};

export default AllClasses;
