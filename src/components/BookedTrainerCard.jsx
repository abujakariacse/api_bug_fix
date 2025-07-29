/* eslint-disable no-unused-vars */
import {
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaChalkboardTeacher,
  FaUsers,
  FaStar,
  FaClipboardList,
} from "react-icons/fa";
import { motion } from "framer-motion";

const BookedTrainerCard = ({
  trainer,
  classesData,
  isLoadingClasses,
  setSelectedTrainer,
  index,
}) => {
  // Get classes for this trainer
  const trainerClasses =
    classesData?.filter((cls) =>
      cls.skills?.some((skill) => trainer.trainerSkills?.includes(skill))
    ) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700"
    >
      <div className="p-6">
        {/* Trainer Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <img
              src={trainer.trainerImage}
              alt={trainer.trainer}
              className="w-16 h-16 rounded-full object-cover border-4 border-lime-500/50"
            />
            <div className="absolute -bottom-1 -right-1 bg-lime-500 rounded-full p-1">
              <div className="bg-gray-900 rounded-full p-0.5">
                <FaUsers className="text-lime-400 text-xs" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{trainer.trainer}</h3>
            <p className="text-gray-400 text-sm">Certified Fitness Trainer</p>
            <div className="flex mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className="text-amber-400 text-sm" />
              ))}
            </div>
          </div>
        </div>

        {/* Class Information */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <FaChalkboardTeacher className="text-lime-400" />
            Available Classes
          </h4>

          {isLoadingClasses ? (
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center">
              <span className="text-gray-500">Loading classes...</span>
            </div>
          ) : trainerClasses.length === 0 ? (
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center">
              <span className="text-gray-500">No classes found</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {trainerClasses.map((cls) => (
                <ClassCard key={cls._id} cls={cls} />
              ))}
            </div>
          )}
        </div>

        {/* Slot Info */}
        <SessionDetails trainer={trainer} />

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition border border-gray-600">
            View Details
          </button>
          <button
            onClick={() => setSelectedTrainer(trainer)}
            className="flex-1 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-lime-500/20"
          >
            <FaStar />
            Review
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Sub-components
const ClassCard = ({ cls }) => (
  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
    <p className="font-medium text-lime-400">{cls.className}</p>
    <div className="flex flex-wrap gap-2 mt-2">
      {cls.skills?.map((skill) => (
        <span
          key={skill}
          className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded capitalize"
        >
          {skill}
        </span>
      ))}
    </div>
    <div className="flex justify-between items-center mt-2">
      <span className="text-gray-400 text-xs">
        Level: {cls.difficultyLevel}
      </span>
      <span className="text-gray-400 text-xs">
        <FaUsers className="inline mr-1" />
        {cls.membersEnrolled?.length || 0}
      </span>
    </div>
  </div>
);

const SessionDetails = ({ trainer }) => (
  <div className="mb-6">
    <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
      <FaCalendarAlt className="text-lime-400" />
      Session Details
    </h4>
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <DetailItem
        icon={<FaClipboardList />}
        label="Package"
        value={trainer.package}
      />
      <DetailItem
        icon={<FaCalendarAlt />}
        label="Day"
        value={trainer.slot.day}
      />
      <DetailItem icon={<FaClock />} label="Time" value={trainer.slot.time} />
      <DetailItem icon={<FaDollarSign />} label="Price" value={trainer.price} />
    </div>
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 mb-3 last:mb-0">
    <div className="bg-lime-900/50 p-2 rounded-lg border border-lime-400/30">
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="font-medium text-white">{value}</p>
    </div>
  </div>
);

export default BookedTrainerCard;
