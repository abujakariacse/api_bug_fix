import { Link } from "react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Loading from "../Shared/Loading";

const ClassCard = ({ classItem }) => {
  const axiosSecure = useAxiosSecure();
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch trainers whose skills match the class skills
  const {
    data: trainers = [],
    isLoading: trainersLoading,
    isError: trainersError,
  } = useQuery({
    queryKey: ["trainers-for-class", classItem._id],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/trainers/for-class/${classItem._id}`
      );
      return res.data;
    },
    // Only fetch trainers if class has skills
    enabled: !!classItem.skills && classItem.skills.length > 0,
  });

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // Format equipment needed text
  const equipmentText = classItem.equipmentNeeded
    ? classItem.equipmentNeeded
    : "None required";

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col border border-gray-700">
      {/* Class Image */}
      <img
        src={classItem.imageUrl}
        alt={classItem.className}
        className="w-full h-48 object-cover"
        loading="lazy"
      />

      {/* Class Content */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Class Header */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-lime-400">
            {classItem.className}
          </h2>
          <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm">
            {classItem.difficultyLevel}
          </span>
        </div>

        {/* Class Description */}
        <div className="mb-2 flex-grow">
          <p
            className={`text-gray-300 ${
              showFullDescription ? "" : "line-clamp-3"
            }`}
          >
            {classItem.description}
          </p>
          {classItem.description.length > 150 && (
            <button
              onClick={toggleDescription}
              className="text-lime-400 hover:text-lime-300 text-sm mt-1 focus:outline-none"
            >
              {showFullDescription ? "Show Less" : "Read More"}
            </button>
          )}
        </div>

        {/* Equipment Needed */}
        <div className="mb-4">
          <p className="text-sm text-gray-400">
            <span className="font-semibold">Equipment:</span> {equipmentText}
          </p>
        </div>

        {/* Skills Focus */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-300 mb-2">Skills Focus:</h3>
          <div className="flex flex-wrap gap-2">
            {classItem.skills?.map((skill, index) => (
              <span
                key={index}
                className="bg-lime-500 text-gray-900 px-2 py-1 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Recommended Trainers */}
        <div className="border-t border-gray-700 pt-4 mt-auto">
          <h3 className="font-semibold text-gray-300 mb-3">
            Recommended Trainers:
          </h3>

          {trainersLoading ? (
            <div className="flex justify-center">
              <p className="text-gray-400">Trainer is loading...</p>
            </div>
          ) : trainersError ? (
            <p className="text-red-400 text-sm">Error loading trainers</p>
          ) : trainers.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {trainers.map((trainer) => (
                <Link
                  to={`/trainers/${trainer._id}?classId=${classItem._id}`}
                  key={trainer._id}
                  className="group relative"
                >
                  <img
                    src={trainer.photoURL || "/default-avatar.jpg"}
                    alt={trainer.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-600 group-hover:border-lime-400 transition-colors"
                    onError={(e) => {
                      e.target.src = "/default-avatar.jpg";
                    }}
                  />
                  <span className="absolute bottom-full left-10 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {trainer.name}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              {classItem.skills?.length > 0
                ? "No trainers found with matching skills"
                : "This class doesn't have specified skills"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
