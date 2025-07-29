import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Shared/Loading";
import Swal from "sweetalert2";
import toastMessage from "../../utils/toastMessage";
import {
  FaUserCheck,
  FaUserTimes,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaCertificate,
  FaClock,
  FaUserTie,
} from "react-icons/fa";
import {
  MdFitnessCenter,
  MdOutlineAccountCircle,
  MdDateRange,
} from "react-icons/md";
import { GiWeightLiftingUp, GiMuscleUp } from "react-icons/gi";
import CustomHelmet from "../../Shared/CustomHelmet";

const fallbackAvatar = "https://i.ibb.co/4pDNDk1/avatar.png";

const TrainerApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: application, isLoading } = useQuery({
    queryKey: ["trainer-application", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/trainer-application/${id}`);
      return res.data;
    },
  });

  const { mutate: approveApplication } = useMutation({
    mutationFn: () => axiosSecure.patch(`/users/approve-trainer/${id}`),
    onSuccess: () => {
      toastMessage("Trainer approved successfully", "success");
      navigate("/dashboard/trainerApplications");
    },
    onError: () => {
      toastMessage("Failed to approve trainer", "error");
    },
  });

  const { mutate: rejectApplication } = useMutation({
    mutationFn: (feedback) =>
      axiosSecure.patch(`/users/reject-trainer/${id}`, { feedback }),
    onSuccess: () => {
      toastMessage("Application rejected", "success");
      navigate("/dashboard/trainerApplications");
    },
    onError: () => {
      toastMessage("Failed to reject application", "error");
    },
  });

  const handleApprove = () => {
    Swal.fire({
      title: "Confirm Approval",
      html: `<p>Approve <b>${application?.name}</b> as a trainer?</p>
             <p class="text-gray-400 text-sm mt-1">They will gain access to all trainer features.</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#a3e635",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve",
      background: "#1f2937",
      color: "#f3f4f6",
    }).then((result) => {
      if (result.isConfirmed) {
        approveApplication();
      }
    });
  };

  const handleReject = () => {
    Swal.fire({
      title: "Provide Rejection Feedback",
      input: "textarea",
      inputPlaceholder: "Explain why this application is being rejected...",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Submit Rejection",
      background: "#1f2937",
      color: "#f3f4f6",
      inputValidator: (value) => {
        if (!value) {
          return "Feedback is required";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        rejectApplication(result.value);
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 sm:p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-lg">
      <CustomHelmet
        title="FitForge - Applied Trainer Details"
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
            <span>Trainer Application Details</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Review all details before making a decision
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            className="flex items-center gap-2 px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-lg transition-colors"
          >
            <FaUserCheck /> Approve
          </button>
          <button
            onClick={handleReject}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <FaUserTimes /> Reject
          </button>
        </div>
      </div>

      {application && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applicant Profile */}
          <div className="lg:col-span-1 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-lime-400 mb-4">
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
              <h3 className="text-xl font-bold text-white text-center">
                {application.name}
              </h3>
              <p className="text-gray-400 text-sm mt-1">{application.email}</p>

              <div className="w-full mt-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <MdOutlineAccountCircle className="text-lime-400" />
                  <span>Age: {application.trainerApplication?.age}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaUserTie className="text-lime-400" />
                  <span>
                    Experience: {application.trainerApplication?.experience}{" "}
                    years
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaCertificate className="text-lime-400" />
                  <span>
                    Certifications:{" "}
                    {application.trainerApplication?.certifications}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MdDateRange className="text-lime-400" />
                  <span>
                    Applied:{" "}
                    {new Date(
                      application.trainerApplication?.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills and Availability */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-lime-400 flex items-center gap-2 mb-4">
                <MdFitnessCenter />
                <span>Skills & Specializations</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {application.trainerApplication?.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-lime-400/10 text-lime-400 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-lime-400 flex items-center gap-2 mb-4">
                  <FaCalendarAlt />
                  <span>Available Days</span>
                </h3>
                <div className="space-y-2">
                  {application.trainerApplication?.slots.map((slot, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-gray-300"
                    >
                      <FaClock className="text-lime-400 text-sm" />
                      <span>{slot.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-lime-400 flex items-center gap-2 mb-4">
                  <GiMuscleUp />
                  <span>Available Time Slots</span>
                </h3>
                <div className="space-y-2">
                  {application.trainerApplication?.slots.map((slot, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-gray-300"
                    >
                      <FaClock className="text-lime-400 text-sm" />
                      <span>{slot.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerApplicationDetail;
