import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import Loading from "../../Shared/Loading";
import Swal from "sweetalert2";
import toastMessage from "../../utils/toastMessage";
import {
  FaUserClock,
  FaUserCheck,
  FaUserTimes,
  FaInfoCircle,
  FaCalendarAlt,
  FaEnvelope,
  FaCertificate,
} from "react-icons/fa";
import { MdFitnessCenter, MdOutlineAccountCircle } from "react-icons/md";
import { IoMdPeople } from "react-icons/io";
import CustomHelmet from "../../Shared/CustomHelmet";

const fallbackAvatar = "https://i.ibb.co/4pDNDk1/avatar.png";

const TrainerApplications = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: applications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["trainer-applications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/trainer-applications");
      return res.data;
    },
  });

  const { mutate: approveApplication } = useMutation({
    mutationFn: (applicationId) => {
      return axiosSecure.patch(`/users/approve-trainer/${applicationId}`);
    },
    onSuccess: () => {
      toastMessage("Trainer approved successfully", "success");
      refetch();
    },
    onError: () => {
      toastMessage("Failed to approve trainer", "error");
    },
  });

  const { mutate: rejectApplication } = useMutation({
    mutationFn: ({ applicationId, feedback }) => {
      return axiosSecure.patch(`/users/reject-trainer/${applicationId}`, {
        feedback,
      });
    },
    onSuccess: () => {
      toastMessage("Application rejected", "success");
      refetch();
    },
    onError: () => {
      toastMessage("Failed to reject application", "error");
    },
  });

  const handleApprove = (id, name) => {
    Swal.fire({
      title: "Approve Trainer?",
      html: `<p>Grant <b>${name}</b> trainer privileges?</p>
             <p class="text-gray-400 text-sm mt-1">They will gain access to trainer features.</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#a3e635",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve",
      background: "#1f2937",
      color: "#f3f4f6",
    }).then((result) => {
      if (result.isConfirmed) {
        approveApplication(id);
      }
    });
  };

  const handleReject = (application) => {
    Swal.fire({
      title: "Reject Application?",
      html: `<p>Reject <b>${application.name}</b>'s trainer application?</p>`,
      icon: "warning",
      input: "textarea",
      inputPlaceholder: "Provide feedback (optional)...",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Confirm Rejection",
      background: "#1f2937",
      color: "#f3f4f6",
      inputValidator: (value) => {
        if (!value) {
          return "Feedback is required";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        rejectApplication({
          applicationId: application._id,
          feedback: result.value,
        });
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 sm:p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-lg">
      <CustomHelmet
        title="FitForge - Trainer Applications"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-lime-400 flex items-center gap-2">
            <FaUserClock className="text-xl sm:text-2xl" />
            <span>Trainer Applications</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Review and manage trainer applications
          </p>
        </div>
        <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
          <IoMdPeople className="text-lime-400 text-sm" />
          <span className="text-white font-medium text-sm">
            {applications.length}{" "}
            {applications.length === 1 ? "Application" : "Applications"}
          </span>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full min-w-3xl">
          <thead className="bg-gray-800 text-gray-300 text-sm">
            <tr>
              <th className="py-3 px-4 text-left">
                <div className="flex items-center gap-2">
                  <MdOutlineAccountCircle className="text-lime-400" />
                  <span>Applicant</span>
                </div>
              </th>
              <th className="py-3 px-4 text-left">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-lime-400" />
                  <span>Contact</span>
                </div>
              </th>
              <th className="py-3 px-4 text-left">
                <div className="flex items-center gap-2">
                  <MdFitnessCenter className="text-lime-400" />
                  <span>Skills</span>
                </div>
              </th>
              <th className="py-3 px-4 text-left">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-lime-400" />
                  <span>Applied On</span>
                </div>
              </th>
              <th className="py-3 px-4 text-right">
                <div className="flex items-center justify-center gap-2">
                  <FaCertificate className="text-lime-400" />
                  <span>Actions</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {applications.length > 0 ? (
              applications.map((application) => (
                <tr
                  key={application._id}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-lime-400">
                        <img
                          src={
                            application.trainerApplication?.profileImage ||
                            application.photoURL ||
                            fallbackAvatar
                          }
                          alt={application.name}
                          onError={(e) => (e.target.src = fallbackAvatar)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-gray-300 font-medium">
                          {application.name}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          Age: {application.trainerApplication?.age}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-sm">
                    {application.email}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {application.trainerApplication?.skills
                        .slice(0, 3)
                        .map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs rounded-full bg-lime-400/10 text-lime-400"
                          >
                            {skill}
                          </span>
                        ))}
                      {application.trainerApplication?.skills.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                          +{application.trainerApplication.skills.length - 3}{" "}
                          more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    {new Date(
                      application.trainerApplication?.createdAt
                    ).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/trainerApplications/${application._id}`
                          )
                        }
                        className="p-2 text-lime-400 hover:text-lime-300 hover:bg-gray-700 rounded-full transition-colors"
                        title="View details"
                      >
                        <FaInfoCircle />
                      </button>
                      <button
                        onClick={() =>
                          handleApprove(application._id, application.name)
                        }
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-gray-700 rounded-full transition-colors"
                        title="Approve"
                      >
                        <FaUserCheck />
                      </button>
                      <button
                        onClick={() => handleReject(application)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-full transition-colors"
                        title="Reject"
                      >
                        <FaUserTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaUserClock className="text-3xl mb-2 text-gray-600" />
                    <p>No pending applications</p>
                    <p className="text-sm mt-1">
                      Currently no trainer applications to review
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

export default TrainerApplications;
