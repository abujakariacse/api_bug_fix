import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "../../Shared/Loading";
import {
  FaUserShield,
  FaTrashAlt,
  FaRegClock,
  FaUserTie,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { MdEmail, MdDateRange } from "react-icons/md";
import { GiWeightLiftingUp } from "react-icons/gi";
import { IoMdPeople } from "react-icons/io";
import { RiUserSettingsLine, RiContactsBookLine } from "react-icons/ri";
import { BsActivity, BsCalendar2Event } from "react-icons/bs";
import Swal from "sweetalert2";
import { format, formatDistanceToNow } from "date-fns";
import toastMessage from "../../utils/toastMessage";
import CustomHelmet from "../../Shared/CustomHelmet";

const fallbackAvatar =
  "https://i.ibb.co/pjw0kYsj/1648123179044-Profile-Avatar.png";

const AllTrainers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch trainers
  const {
    data: trainers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allTrainers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/trainers");
      return res.data;
    },
  });

  // Delete trainer (demote to member)
  const { mutate: deleteTrainer } = useMutation({
    mutationFn: (trainerId) =>
      axiosSecure.patch(`/users/remove-trainer/${trainerId}`),
    onSuccess: (res) => {
      if (res.data?.success) {
        toastMessage("Trainer demoted to member successfully", "success");
        queryClient.invalidateQueries(["allTrainers"]);
      } else {
        toastMessage("Something went wrong", "error");
      }
    },
    onError: () => {
      toastMessage("Failed to demote trainer", "error");
    },
  });

  const handleDeleteTrainer = (trainer) => {
    Swal.fire({
      title: "Demote Trainer?",
      html: `<p>Remove <b>${trainer.name}</b>'s trainer privileges?</p>
             <p class="text-gray-400 text-sm mt-1">They will become a regular member.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#a3e635",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, demote",
      background: "#1f2937",
      color: "#f3f4f6",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTrainer(trainer._id);
      }
    });
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-red-500 text-center mt-8">
        Failed to load trainers
      </div>
    );
  return (
    <div className="p-4 sm:p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-lg">
      <CustomHelmet
        title="FitForge - All Trainers"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-lime-400 flex items-center gap-2">
            <GiWeightLiftingUp className="text-xl sm:text-2xl" />
            <span>Certified Trainers</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Manage your team of fitness professionals
          </p>
        </div>
        <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
          <FaUserTie className="text-lime-400 text-sm" />
          <span className="text-white font-medium text-sm">
            {trainers.length}{" "}
            {trainers.length === 1 ? "Professional" : "Professionals"}
          </span>
        </div>
      </div>

      {/* Trainers Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full min-w-3xl">
          <thead className="bg-gray-800 text-gray-300 text-sm">
            <tr>
              <th className="py-3 px-4 text-left">
                <div className="flex items-center gap-2">
                  <RiUserSettingsLine className="text-lime-400" />
                  <span>Trainer Profile</span>
                </div>
              </th>
              <th className="py-3 px-4 text-left">
                <div className="flex items-center gap-2">
                  <RiContactsBookLine className="text-lime-400" />
                  <span>Contact</span>
                </div>
              </th>
              <th className="py-3 px-4 text-left">
                <div className="flex items-center gap-2">
                  <BsActivity className="text-lime-400" />
                  <span>Last Active</span>
                </div>
              </th>
              <th className="py-3 px-4 text-left">
                <div className="flex items-center gap-2">
                  <BsCalendar2Event className="text-lime-400" />
                  <span>Member Since</span>
                </div>
              </th>
              <th className="py-3 px-4 text-right">
                <div className="flex items-center justify-center gap-2">
                  <FaUserShield className="text-lime-400" />
                  <span>Actions</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {trainers.length > 0 ? (
              trainers.map((trainer) => (
                <tr
                  key={trainer._id}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-lime-400">
                        <img
                          src={trainer.photoURL || fallbackAvatar}
                          alt={trainer.name}
                          onError={(e) => (e.target.src = fallbackAvatar)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-gray-300 font-medium">
                          {trainer.name}
                        </p>
                        <span className="bg-lime-400/10 text-lime-400 px-2 py-0.5 rounded-full text-xs mt-1 inline-flex items-center gap-1">
                          <FaChalkboardTeacher className="text-xs" />
                          Certified Trainer
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-sm">
                    <div className="flex items-center gap-1">
                      <MdEmail className="text-lime-400" />
                      {trainer.email}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-1">
                      <FaRegClock className="text-xs text-lime-400" />
                      {formatDistanceToNow(
                        new Date(trainer.activityLog.lastLogin)
                      )}{" "}
                      ago
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-1">
                      <MdDateRange className="text-lime-400" />
                      {format(
                        new Date(trainer.activityLog.createdAt),
                        "MMM dd, yyyy"
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteTrainer(trainer)}
                      className="text-red-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-700 transition-colors"
                      title="Demote to member"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <IoMdPeople className="text-3xl mb-2 text-gray-600" />
                    <p>No trainers available</p>
                    <p className="text-sm mt-1">
                      Currently no certified trainers in your network
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTrainers;
