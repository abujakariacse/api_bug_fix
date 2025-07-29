import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaEdit, FaImage, FaUser, FaUserTie } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Shared/Loading";
import toastMessage from "../../utils/toastMessage";
import CustomHelmet from "../../Shared/CustomHelmet";

const AddForum = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(null);

  // Fetch user data with role information
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userEmail", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/activity?email=${user.email}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate: addForum } = useMutation({
    mutationFn: async (forumData) => {
      setIsUploading(true);

      const formData = new FormData();

      // Append user info and forum data
      formData.append("userName", user.displayName);
      formData.append("userPhotoURL", user.photoURL);
      formData.append("role", userData.role);
      formData.append("forumTitle", forumData.forumTitle);
      formData.append("forumDescription", forumData.forumDescription);
      formData.append("image", imageFile);

      const res = await axiosSecure.post("/forums", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      reset();
      setImageFile(null);
      setImageError(null);
      setIsUploading(false);
      queryClient.invalidateQueries(["forums"]);
      Swal.fire({
        title: "Forum Created!",
        text: "Your forum post has been successfully published",
        icon: "success",
        confirmButtonColor: "#3b82f6",
        background: "#1f2937",
        color: "#f3f4f6",
      });
    },
    onError: (error) => {
      setIsUploading(false);
      toastMessage(
        error.response?.data?.message || "Failed to create forum",
        "error"
      );
    },
  });

  const onSubmit = (data) => {
    // Validate image before submitting
    if (!imageFile) {
      setImageError("Please select an image");
      toastMessage("Image is required", "error");
      return;
    }

    // Clear any previous image errors
    setImageError(null);
    addForum(data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Clear previous errors
      setImageError(null);

      // Validate file size
      if (file.size > 2 * 1024 * 1024) {
        setImageError("Image size should be less than 2MB");
        toastMessage("Image size should be less than 2MB", "error");
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setImageError("Only JPG, PNG, GIF, or WEBP images are allowed");
        toastMessage("Invalid image format", "error");
        return;
      }

      setImageFile(file);
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="text-red-500 text-center py-10">Error loading user data</p>
    );

  return (
    <div className="p-4 sm:p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-lg max-w-3xl mx-auto">
      <CustomHelmet
        title="FitForge - Add Forum"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <FaEdit className="text-3xl text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-blue-400">
              Create New Forum
            </h2>
            <p className="text-gray-400 mt-1">
              Share your knowledge and start a discussion
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 mb-6 p-3 bg-gray-800 rounded-lg">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="bg-gray-700 p-2 rounded-full">
            <FaUser className="text-xl text-gray-400" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-300">
              {user.displayName}
            </span>
            {userData?.role && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  userData.role === "admin"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {userData.role === "admin" ? (
                  <span className="flex items-center gap-1">
                    <FaUserTie className="inline" /> Admin
                  </span>
                ) : (
                  "Trainer"
                )}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Your post will be visible to all members
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Forum Title */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-1 block">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register("forumTitle", {
              required: "Title is required",
              maxLength: {
                value: 100,
                message: "Title should not exceed 100 characters",
              },
            })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-300"
            placeholder="Enter a clear and descriptive title"
          />
          {errors.forumTitle && (
            <p className="text-red-400 text-sm mt-1">
              {errors.forumTitle.message}
            </p>
          )}
        </div>

        {/* Forum Description */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-1 block">
            Content <span className="text-red-400">*</span>
          </label>
          <textarea
            {...register("forumDescription", {
              required: "Content is required",
              minLength: {
                value: 30,
                message: "Content should be at least 30 characters",
              },
              maxLength: {
                value: 1000,
                message: "Content should not exceed 1000 characters",
              },
            })}
            rows="5"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-300"
            placeholder="Share your thoughts, questions, or knowledge..."
          ></textarea>
          {errors.forumDescription && (
            <p className="text-red-400 text-sm mt-1">
              {errors.forumDescription.message}
            </p>
          )}
        </div>

        {/* Forum Image - Required (handled manually) */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
            <FaImage className="text-gray-300" />
            Add Image <span className="text-red-400">*</span>
          </label>

          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <div
                className={`px-4 py-2 bg-gray-800 border ${
                  imageError ? "border-red-500" : "border-gray-700"
                } rounded-lg hover:bg-gray-700 transition-colors text-gray-300 flex items-center justify-between`}
              >
                <span>{imageFile ? imageFile.name : "Select an image"}</span>
                <FaImage className="text-gray-400" />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {imageFile ? (
              <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-blue-400">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-dashed border-gray-600 flex items-center justify-center">
                <FaImage className="text-gray-500 text-2xl" />
              </div>
            )}
          </div>

          {/* Image error message */}
          {imageError && (
            <p className="text-red-500 text-sm mt-1">{imageError}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Supported formats: JPG, PNG, GIF, WEBP • Max size: 2MB
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full ${
              isUploading
                ? "bg-blue-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            } text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2`}
          >
            {isUploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Publishing...
              </>
            ) : (
              <>
                <FaEdit className="text-lg" />
                <span>Publish Forum</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddForum;
