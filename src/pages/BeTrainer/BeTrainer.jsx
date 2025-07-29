import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Shared/Loading";
import CustomHelmet from "../../Shared/CustomHelmet";

const skillOptions = [
  "strength",
  "cardio",
  "flexibility",
  "endurance",
  "yoga",
  "bodybuilding",
  "weightlifting",
  "meditation",
];

const dayOptions = [
  { value: "Sunday", label: "Sunday" },
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
];

const timeSlotOptions = [
  { value: "Morning (7am-9am)", label: "Morning (7am-9am)" },
  { value: "Evening (4pm-6pm)", label: "Evening (4pm-6pm)" },
  { value: "Night (8pm-10pm)", label: "Night (8pm-10pm)" },
];

const BeTrainer = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const slots = selectedDays.flatMap((dayObj) =>
    selectedTimeSlots.map((timeObj) => ({
      day: dayObj.value,
      time: timeObj.value,
    }))
  );
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email || "",
      name: user?.displayName || "",
      age: "",
      experience: "",
      certifications: "",
      skills: [],
      facebook: "",
      instagram: "",
      linkedin: "",
    },
  });

  const photo = watch("photo");

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.trainerApplication) {
        setSelectedDays(
          data.trainerApplication.availableDays.map((day) => ({
            value: day,
            label: day,
          }))
        );
        setSelectedTimeSlots(
          data.trainerApplication.availableTimeSlots.map((time) => ({
            value: time,
            label: time,
          }))
        );
      }
    },
  });

  const onSubmit = async (data) => {
    if (selectedDays.length === 0) {
      Swal.fire({
        title: "Warning!",
        text: "Please select at least one available day",
        icon: "warning",
      });
      return;
    }

    if (selectedTimeSlots.length === 0) {
      Swal.fire({
        title: "Warning!",
        text: "Please select at least one time slot",
        icon: "warning",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("age", data.age);
      formData.append("experience", data.experience);
      formData.append("certifications", data.certifications);
      formData.append("slots", JSON.stringify(slots || []));
      formData.append("skills", JSON.stringify(data.skills || []));
      formData.append("facebook", data.facebook || "");
      formData.append("instagram", data.instagram || "");
      formData.append("linkedin", data.linkedin || "");

      if (data.photo && data.photo.length > 0) {
        formData.append("imageFile", data.photo[0]);
      }

      await axiosSecure.patch("/users/become-trainer", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await refetch();

      Swal.fire({
        title: "Success!",
        text: "Your trainer application has been submitted",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to submit application",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateApplication = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You'll need to submit a new application form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (result.isConfirmed) {
        setIsUpdating(true);
        const response = await axiosSecure.patch(
          `/users/delete-trainer-application/${user.email}`
        );

        if (response.data.success) {
          // Reset form state
          setSelectedDays([]);
          setSelectedTimeSlots([]);

          reset({
            email: user?.email || "",
            name: user?.displayName || "",
            age: "",
            experience: "",
            certifications: "",
            skills: [],
            photo: null,
            facebook: "",
            instagram: "",
            linkedin: "",
          });

          // Refetch user data
          await queryClient.invalidateQueries(["user", user?.email]);

          Swal.fire(
            "Reset!",
            "Your application has been reset. You can now submit a new one.",
            "success"
          );
        }
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Failed to reset application",
        "error"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <Loading />;

  if (userData?.trainerApplication) {
    const application = userData.trainerApplication;
    return (
      <div className="pt-24 px-4 pb-4">
        <CustomHelmet
          title="FitForge - Be a trainer"
          meta={[
            { name: "description", content: "Learn more about our website." },
            { property: "og:title", content: "About Us - My Website" },
          ]}
        />
        <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-lime-400 mb-4">
            Trainer Application Status
          </h2>
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="flex items-start gap-6 mb-6">
              <img
                src={userData.photoURL || "/default-avatar.jpg"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-white">
                  {application.name}
                </h3>
                <p className="text-gray-300">{application.email}</p>
                <p className="text-gray-300">Age: {application.age}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`${
                      application.status === "approved"
                        ? "text-green-400"
                        : application.status === "rejected"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {application.status}
                  </span>
                </p>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Applied on:</span>{" "}
                  {new Date(application.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-300">
                  <span className="font-semibold">Experience:</span>{" "}
                  {application.experience} years
                </p>
              </div>
              <div>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Certifications:</span>{" "}
                  {application.certifications}
                </p>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Skills:</span>{" "}
                  {application.skills.join(", ")}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-300 font-semibold mb-2">
                Available Slots:
              </p>
              <div className="bg-gray-700 p-4 rounded-lg space-y-2">
                {application.slots &&
                  Object.entries(
                    application.slots.reduce((acc, slot) => {
                      if (!acc[slot.day]) acc[slot.day] = [];
                      acc[slot.day].push(slot.time);
                      return acc;
                    }, {})
                  ).map(([day, times]) => (
                    <p key={day} className="text-gray-300">
                      <span className="font-semibold">{day}:</span>{" "}
                      {times.join(", ")}
                    </p>
                  ))}
              </div>
            </div>

            {(application.facebook ||
              application.instagram ||
              application.linkedin) && (
              <div className="mb-4">
                <p className="text-gray-300 font-semibold mb-2">
                  Social Media:
                </p>
                <div className="flex gap-4">
                  {application.facebook && (
                    <a
                      href={application.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Facebook
                    </a>
                  )}
                  {application.instagram && (
                    <a
                      href={application.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:underline"
                    >
                      Instagram
                    </a>
                  )}
                  {application.linkedin && (
                    <a
                      href={application.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}

            {application.status === "approved" && (
              <p className="text-green-400 mt-4">
                Congratulations! Your trainer application has been approved.
              </p>
            )}
            {application.status === "rejected" && (
              <div className="mt-4">
                <p className="text-red-400 mb-2">
                  Your application was rejected. You can update your information
                  and reapply:
                </p>
                <button
                  onClick={handleUpdateApplication}
                  disabled={isUpdating}
                  className="bg-lime-500 hover:bg-lime-600 text-gray-900 font-bold py-2 px-4 rounded-lg disabled:bg-lime-700 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isUpdating ? "Updating..." : "Update Application"}
                </button>
              </div>
            )}
            {application.status === "pending" && (
              <p className="text-yellow-400 mt-4">
                Your application is under review. Please wait for admin
                approval.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 pb-4">
      <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-lime-400 mb-6">
          Become a Trainer
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                {...register("name", { required: "Full name is required" })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
              />
              {errors.name && (
                <p className="text-red-400 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                {...register("email")}
                readOnly
                className="w-full px-4 py-2 bg-gray-600 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Age</label>
              <input
                type="number"
                {...register("age", {
                  required: "Age is required",
                  min: {
                    value: 18,
                    message: "You must be at least 18 years old",
                  },
                  max: { value: 100, message: "Please enter a valid age" },
                })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
              />
              {errors.age && (
                <p className="text-red-400 mt-1">{errors.age.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Profile Photo</label>
              <div className="flex items-center gap-4">
                <img
                  src={user?.photoURL || "/default-avatar.jpg"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <label
                  htmlFor="photo"
                  className="flex-1 flex items-center bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 cursor-pointer hover:border-lime-400 transition"
                >
                  <span className="text-gray-300 truncate">
                    {photo?.[0]?.name || "Change profile photo"}
                  </span>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("photo")}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                {...register("experience", {
                  required: "Experience is required",
                  min: { value: 0, message: "Must be at least 0" },
                })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
              />
              {errors.experience && (
                <p className="text-red-400 mt-1">{errors.experience.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Certifications</label>
              <input
                type="text"
                {...register("certifications", {
                  required: "Certifications are required",
                })}
                placeholder="e.g. ACE, NASM, etc."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
              />
              {errors.certifications && (
                <p className="text-red-400 mt-1">
                  {errors.certifications.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Skills (Select at least one)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {skillOptions.map((skill) => (
                <div key={skill} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`skill-${skill}`}
                    value={skill}
                    {...register("skills", {
                      required: "Please select at least one skill",
                    })}
                    className="h-4 w-4 text-lime-500 rounded border-gray-600 bg-gray-700 focus:ring-lime-500"
                  />
                  <label
                    htmlFor={`skill-${skill}`}
                    className="ml-2 text-gray-300"
                  >
                    {skill}
                  </label>
                </div>
              ))}
            </div>
            {errors.skills && (
              <p className="text-red-400 mt-1">{errors.skills.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Available Days</label>
              <Select
                isMulti
                options={dayOptions}
                value={selectedDays}
                onChange={setSelectedDays}
                className="text-gray-900"
                placeholder="Select days..."
                closeMenuOnSelect={false}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Available Time Slots
              </label>
              <Select
                isMulti
                options={timeSlotOptions}
                value={selectedTimeSlots}
                onChange={setSelectedTimeSlots}
                className="text-gray-900"
                placeholder="Select time slots..."
                closeMenuOnSelect={false}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">
                Facebook Profile
              </label>
              <input
                type="url"
                {...register("facebook")}
                placeholder="https://facebook.com/username"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Instagram Profile
              </label>
              <input
                type="url"
                {...register("instagram")}
                placeholder="https://instagram.com/username"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                {...register("linkedin")}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-lime-500 hover:bg-lime-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-lime-700 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Submitting..." : "Apply to be a Trainer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BeTrainer;
