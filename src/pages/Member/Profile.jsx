/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaUserEdit,
  FaCamera,
  FaSignInAlt,
  FaUserClock,
  FaSpinner,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { format } from "date-fns";
import Loading from "../../Shared/Loading";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import CustomHelmet from "../../Shared/CustomHelmet";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch user data
  const {
    data: userData = {},
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Initialize form data
  useEffect(() => {
    if (userData) {
      setName(userData.name || user?.displayName || "");
    }
  }, [userData, user]);

  // Handle file selection for image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Update profile mutation
  const { mutate: updateProfile } = useMutation({
    mutationFn: async () => {
      setUpdating(true);
      const formData = new FormData();

      // Only include name if it's changed
      if (name && name !== userData.name) {
        formData.append("name", name);
      }

      // Only include file if selected
      if (selectedFile) {
        formData.append("imageFile", selectedFile);
      }

      // Send request to backend
      const response = await axiosSecure.patch(
        `/users/profileUpdate?email=${user.email}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      // Update Firebase with new profile data
      const updateFirebase = async () => {
        try {
          await updateUser({
            ...user,
            displayName: data.updatedName || name || user.displayName,
            photoURL: data.updatedPhotoURL || previewImage || user.photoURL,
          });
        } catch (firebaseError) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Profile Updated!",
            text: "Profile not updated properly",
            showConfirmButton: false,
            timer: 2000,
            background: "#1f2937",
            color: "#f3f4f6",
          });
        }
      };

      updateFirebase().then(() => {
        // Refresh user data
        refetch();
        queryClient.invalidateQueries(["userProfile"]);

        setIsEditing(false);
        setSelectedFile(null);
        setPreviewImage("");
        setUpdating(false);

        // Show success notification
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Profile Updated!",
          text: "Your profile has been updated successfully",
          showConfirmButton: false,
          timer: 2000,
          background: "#1f2937",
          color: "#f3f4f6",
        });
      });
    },
    onError: (error) => {
      setUpdating(false);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Please try again after some time",
        background: "#1f2937",
        color: "#f3f4f6",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Only submit if there are changes
    if ((name && name !== userData.name) || selectedFile) {
      updateProfile();
    } else {
      Swal.fire({
        icon: "info",
        title: "No Changes",
        text: "You haven't made any changes to your profile",
        background: "#1f2937",
        color: "#f3f4f6",
      });
    }
  };

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-center text-red-500">
        Error loading profile: {error.message}
      </div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <CustomHelmet
        title="FitForge - Profile"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 sm:p-8 text-center border-b border-gray-700">
            <div className="flex items-center justify-center mb-4">
              <div className="w-4 h-4 bg-lime-400 rounded-full mr-2 animate-pulse"></div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
                My Profile
              </h1>
            </div>
            <p className="text-gray-400">Manage your account information</p>
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Picture Section */}
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 to-emerald-400/20 rounded-full blur-sm"></div>
                    <img
                      src={
                        previewImage ||
                        userData.photoURL ||
                        user?.photoURL ||
                        "/default-avatar.jpg"
                      }
                      alt="Profile"
                      className="relative w-40 h-40 rounded-full object-cover border-4 border-gray-800 shadow-lg z-10"
                    />
                  </div>
                  {isEditing && (
                    <motion.label
                      whileHover={{ scale: 1.1 }}
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full cursor-pointer border border-gray-700 hover:bg-lime-500/20 transition-colors z-20"
                    >
                      <FaCamera className="text-lime-400" />
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </motion.label>
                  )}
                </motion.div>

                {!isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="mt-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 text-gray-900 font-medium rounded-lg transition-all shadow-lg shadow-lime-400/10"
                  >
                    <FaUserEdit /> Edit Profile
                  </motion.button>
                )}
              </div>

              {/* Profile Details Section */}
              <div className="w-full md:w-2/3">
                {isEditing ? (
                  <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/30 transition-all"
                          required
                          disabled={updating}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user?.email}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                          disabled
                        />
                      </div>

                      <div className="flex gap-4 pt-6">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          disabled={updating}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 text-gray-900 font-medium rounded-lg transition-all flex items-center justify-center disabled:opacity-80"
                        >
                          {updating ? (
                            <>
                              <FaSpinner className="animate-spin mr-2" />
                              Saving Changes...
                            </>
                          ) : (
                            <>
                              <FaCheck className="mr-2" />
                              Save Changes
                            </>
                          )}
                        </motion.button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setPreviewImage("");
                            setSelectedFile(null);
                            setName(userData.name || user?.displayName || "");
                          }}
                          disabled={updating}
                          className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          <FaTimes className="inline mr-2" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-white">
                        {userData.name || user?.displayName}
                      </h2>
                      <p className="text-gray-300">{user?.email}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl">
                        <div className="bg-lime-500/10 p-3 rounded-full">
                          <FaSignInAlt className="text-lime-400 text-xl" />
                        </div>
                        <div>
                          <h3 className="text-gray-400 text-sm uppercase tracking-wider">
                            Last Login
                          </h3>
                          <p className="text-white">
                            {userData?.activityLog?.lastLogin
                              ? format(
                                  new Date(userData.activityLog.lastLogin),
                                  "MMM dd, yyyy 'at' hh:mm a"
                                )
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl">
                        <div className="bg-lime-500/10 p-3 rounded-full">
                          <FaUserClock className="text-lime-400 text-xl" />
                        </div>
                        <div>
                          <h3 className="text-gray-400 text-sm uppercase tracking-wider">
                            Member Since
                          </h3>
                          <p className="text-white">
                            {userData?.activityLog?.createdAt
                              ? format(
                                  new Date(userData.activityLog.createdAt),
                                  "MMM dd, yyyy"
                                )
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {userData.role === "member" && (
                      <div className="pt-4">
                        <h3 className="text-lg font-semibold text-lime-400 mb-3">
                          Membership Status
                        </h3>
                        <div
                          className={`p-4 rounded-xl ${
                            userData?.activityLog?.paymentHistory?.some(
                              (p) => p.paymentStatus === "paid"
                            )
                              ? "bg-gradient-to-r from-lime-500/10 to-emerald-500/10 border border-lime-500/30"
                              : "bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30"
                          }`}
                        >
                          <p
                            className={`font-medium ${
                              userData?.activityLog?.paymentHistory?.some(
                                (p) => p.paymentStatus === "paid"
                              )
                                ? "text-lime-400"
                                : "text-amber-400"
                            }`}
                          >
                            {userData?.activityLog?.paymentHistory?.some(
                              (p) => p.paymentStatus === "paid"
                            )
                              ? "Active Membership"
                              : "No Active Membership"}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            {userData?.activityLog?.paymentHistory?.some(
                              (p) => p.paymentStatus === "paid"
                            )
                              ? "You have access to all premium features"
                              : "Upgrade to access premium features"}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
          >
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">
              Total Classes
            </h3>
            <p className="text-3xl font-bold text-lime-400">
              {userData?.activityLog?.paymentHistory?.length || 0}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
          >
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">
              Active Memberships
            </h3>
            <p className="text-3xl font-bold text-lime-400">
              {userData?.activityLog?.paymentHistory?.filter(
                (p) => p.paymentStatus === "paid"
              ).length || 0}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
          >
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">
              Account Status
            </h3>
            <p className="text-3xl font-bold text-lime-400 capitalize">
              {userData.role || "member"}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
