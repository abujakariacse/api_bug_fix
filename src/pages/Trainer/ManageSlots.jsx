/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FaTrash,
  FaUser,
  FaCalendarDay,
  FaClock,
  FaDollarSign,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Shared/Loading";
import ConfirmationModal from "../../components/ConfirmationModal";
import useAuth from "../../Hooks/useAuth";
import toastMessage from "../../utils/toastMessage";
import CustomHelmet from "../../Shared/CustomHelmet";

const ManageSlots = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [deleteType, setDeleteType] = useState("slot");

  // Fetch trainer's data
  const {
    data: trainerData = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["trainer-slots", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/activity?email=${user.email}`);
      return res.data;
    },
  });

  // Delete slot mutation - UPDATED WITH PORT
  const { mutate: deleteSlot, isPending: isDeleting } = useMutation({
    mutationFn: async (slotInfo) => {
      const { slot, deleteType, bookingId, userId } = slotInfo;
      await axiosSecure.delete("/delete-slot", {
        // ADD YOUR BACKEND PORT
        data: {
          trainerId: trainerData._id,
          slot,
          deleteType,
          bookingId,
          userId,
        },
      });
    },
    onSuccess: () => {
      alert("success");
      toastMessage("Deleted successfully!", "success");
      queryClient.invalidateQueries(["trainer-slots"]);
    },
    onError: (error) => {
      alert("hello");
      error && toastMessage("Failed to delete please try again", "error");
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  const bookedSlots = trainerData?.activityLog?.bookedSlots || [];
  const availableSlots = trainerData?.trainerApplication?.slots || [];

  const handleDeleteClick = (slot, type = "booking") => {
    setSelectedSlot(slot);
    setDeleteType(type);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSlot) {
      const slotToDelete =
        deleteType === "booking" ? selectedSlot.slot : selectedSlot;

      // Prepare deletion data
      const deleteData = {
        slot: slotToDelete,
        deleteType,
        bookingId: deleteType === "booking" ? selectedSlot._id : undefined,
        userId: deleteType === "booking" ? selectedSlot.userId : undefined,
      };

      deleteSlot(deleteData);
      setIsModalOpen(false);
    }
  };

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <CustomHelmet
          title="FitForge - Manage Slots"
          meta={[
            { name: "description", content: "Learn more about our website." },
            { property: "og:title", content: "About Us - My Website" },
          ]}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900/80 rounded-xl p-8 border border-red-500/30"
        >
          <FaExclamationTriangle className="text-red-400 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Failed to load trainer data
          </h2>
          <p className="text-gray-400 mb-6">
            {error?.message || "Please try again later"}
          </p>
          <button
            onClick={() => queryClient.refetchQueries(["trainer-slots"])}
            className="bg-lime-500 hover:bg-lime-600 text-gray-900 font-medium py-2 px-4 rounded"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-900 rounded-xl"
    >
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
          Manage Training Slots
        </h1>
        <p className="text-gray-300 text-center max-w-3xl mx-auto">
          Manage your available time slots and booked training sessions
        </p>
      </div>

      {/* Available Slots Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-lime-400 mb-6 flex items-center gap-2">
          <FaCalendarDay /> Available Time Slots
        </h2>

        {availableSlots.length === 0 ? (
          <div className="bg-gray-900/50 rounded-xl p-8 border border-dashed border-gray-700 text-center">
            <FaInfoCircle className="text-lime-400 text-3xl mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No available time slots</p>
            <p className="text-gray-500 text-sm">
              Add new slots in your trainer profile to accept bookings
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSlots.map((slot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 rounded-xl p-5 border border-gray-800 hover:border-lime-400/30 transition-all group relative"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">{slot.day}</h3>
                    <p className="text-gray-300">{slot.time}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(slot, "slot")}
                    className="text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100 p-2"
                    title="Delete slot"
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Count of bookings for this slot */}
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                    {
                      bookedSlots.filter(
                        (b) =>
                          b.slot.day === slot.day && b.slot.time === slot.time
                      ).length
                    }{" "}
                    bookings
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Booked Slots Section */}
      <div>
        <h2 className="text-2xl font-bold text-lime-400 mb-6 flex items-center gap-2">
          <FaUser /> Booked Sessions
        </h2>

        {bookedSlots.length === 0 ? (
          <div className="bg-gray-900/50 rounded-xl p-8 border border-dashed border-gray-700 text-center">
            <FaInfoCircle className="text-lime-400 text-3xl mx-auto mb-4" />
            <p className="text-gray-400">No booked sessions</p>
          </div>
        ) : (
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-medium text-lime-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-lime-400 uppercase tracking-wider">
                      Session Details
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-lime-400 uppercase tracking-wider">
                      Package
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-lime-400 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-lime-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                  {bookedSlots.map((slot) => (
                    <motion.tr
                      key={slot._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ backgroundColor: "rgba(30, 41, 59, 0.5)" }}
                      className="text-gray-300"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-full border-2 border-lime-400/50 object-cover"
                              src={slot.userImage || "/default-avatar.jpg"}
                              alt={slot.userName}
                              onError={(e) => {
                                e.target.src = "/default-avatar.jpg";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-100">
                              {slot.userName}
                            </div>
                            <div className="text-xs text-gray-400 flex items-center mt-1">
                              <FaUser className="mr-1 text-lime-400" />
                              {slot.userEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-sm">
                        <div className="flex items-center">
                          <FaCalendarDay className="mr-2 text-lime-400" />
                          <span className="font-medium">{slot.slot.day}</span>
                        </div>
                        <div className="flex items-center mt-2">
                          <FaClock className="mr-2 text-lime-400" />
                          <span>{slot.slot.time}</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          Booked on:{" "}
                          {new Date(slot.paidAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-sm">
                        <div className="font-medium">{slot.package}</div>
                        <div className="mt-1 text-xs bg-lime-400/10 text-lime-400 inline-block px-2 py-1 rounded-full">
                          {slot.classId ? "Group Class" : "Personal Training"}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-sm">
                        <div className="flex items-center">
                          <FaDollarSign className="mr-1 text-lime-400" />
                          <span className="font-medium">{slot.price}</span>
                        </div>
                        <div
                          className={`mt-1 inline-flex text-xs px-2 py-1 rounded-full ${
                            slot.paymentStatus === "paid"
                              ? "bg-emerald-400/10 text-emerald-400"
                              : "bg-amber-400/10 text-amber-400"
                          }`}
                        >
                          {slot.paymentStatus}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-sm">
                        <button
                          onClick={() => handleDeleteClick(slot, "booking")}
                          className="flex items-center text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <span className="loading loading-spinner loading-xs mr-2"></span>
                          ) : (
                            <FaTrash className="mr-1" />
                          )}
                          <span>Delete</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={deleteType === "slot" ? "Delete Time Slot" : "Delete Booking"}
        message={
          deleteType === "slot"
            ? `Are you sure you want to permanently delete the ${
                selectedSlot?.day
              } ${selectedSlot?.time} slot? This will also delete all ${
                bookedSlots.filter(
                  (b) =>
                    b.slot.day === selectedSlot?.day &&
                    b.slot.time === selectedSlot?.time
                ).length
              } bookings associated with this slot.`
            : `Are you sure you want to delete the booking for ${selectedSlot?.userName} on ${selectedSlot?.slot.day} at ${selectedSlot?.slot.time}?`
        }
        confirmText={deleteType === "slot" ? "Delete Slot" : "Delete Booking"}
        confirmColor="red"
        isLoading={isDeleting}
      />
    </motion.div>
  );
};

export default ManageSlots;
