import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Shared/Loading";
import toastMessage from "../../utils/toastMessage";
import {
  MdCalendarToday,
  MdAccessTime,
  MdClass,
  MdAddCircleOutline,
  MdPerson,
  MdEmail,
  MdWorkHistory,
  MdSchool,
  MdFitnessCenter,
  MdSchedule,
} from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import CustomHelmet from "../../Shared/CustomHelmet";

// Available time slots
const timeSlotOptions = [
  { value: "Morning (7am-9am)", label: "Morning (7am-9am)" },
  { value: "Evening (4pm-6pm)", label: "Evening (4pm-6pm)" },
  { value: "Night (8pm-10pm)", label: "Night (8pm-10pm)" },
];

const days = [
  { value: "Sunday", label: "Sunday" },
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
];

const AddSlot = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch trainer's data
  const { data: trainerData, isLoading } = useQuery({
    queryKey: ["trainer-slots", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/activity?email=${user.email}`);
      return res.data;
    },
  });

  // Extract trainer skills
  const trainerSkills = useMemo(() => {
    return trainerData?.trainerApplication?.skills || [];
  }, [trainerData]);

  // Fetch classes from server
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axiosSecure.get("/classes");
        const options = res.data.data
          .filter((cls) =>
            cls.skills.some((skill) => trainerSkills.includes(skill))
          )
          .map((cls) => ({
            value: cls._id,
            label: cls.className,
            ...cls,
          }));
        setClassOptions(options);
      } catch (error) {
        error && setClassOptions([]);
      }
    };

    if (trainerSkills.length > 0) {
      fetchClasses();
    }
  }, [axiosSecure, trainerSkills]);

  // Memoize existing slots
  const existingSlots = useMemo(() => {
    return trainerData?.trainerApplication?.slots || [];
  }, [trainerData]);

  // Filter available days
  const availableDays = useMemo(() => {
    const usedDays = existingSlots.map((slot) => slot.day);
    return days.filter((option) => !usedDays.includes(option.value));
  }, [existingSlots]);

  // Filter available times
  const availableTimes = useMemo(() => {
    if (selectedDays.length === 0) return timeSlotOptions;

    const takenTimes = existingSlots
      .filter((slot) => selectedDays.some((day) => day.value === slot.day))
      .map((slot) => slot.time);

    return timeSlotOptions.filter((time) => !takenTimes.includes(time.value));
  }, [selectedDays, existingSlots]);

  // Mutation to add new slots
  const addSlotMutation = useMutation({
    mutationFn: async (newSlots) => {
      await axiosSecure.patch("/trainers/add-slots", {
        trainerId: trainerData._id,
        slots: newSlots,
      });
    },
    onSuccess: () => {
      toastMessage("Slots added successfully!", "success");
      queryClient.invalidateQueries(["trainer-slots"]);
      resetForm();
    },
    onError: (error) => {
      toastMessage("Failed to add slots: " + error.message, "error");
    },
  });

  // Reset form
  const resetForm = () => {
    setSelectedDays([]);
    setSelectedTimes([]);
    setSelectedClass(null);
    setIsSubmitting(false);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedDays.length === 0 || selectedTimes.length === 0) {
      toastMessage("Please select at least one day and time slot", "error");
      return;
    }

    setIsSubmitting(true);

    const newSlots = [];
    selectedDays.forEach((day) => {
      selectedTimes.forEach((time) => {
        newSlots.push({
          day: day.value,
          time: time.value,
          classId: selectedClass?.value || null,
          className: selectedClass?.label || null,
        });
      });
    });

    addSlotMutation.mutate(newSlots);
  };

  if (isLoading) {
    return <Loading />;
  }

  const trainerApp = trainerData?.trainerApplication;

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#1f2937",
      borderColor: state.isFocused ? "#a3e635" : "#374151",
      boxShadow: state.isFocused ? "0 0 0 1px #a3e635" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#a3e635" : "#4b5563",
      },
      minHeight: "44px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#a3e635"
        : state.isFocused
        ? "#374151"
        : "#1f2937",
      color: state.isSelected ? "#1f2937" : "#f3f4f6",
      "&:active": {
        backgroundColor: "#a3e635",
        color: "#1f2937",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#a3e635",
      color: "#1f2937",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#1f2937",
      fontWeight: "500",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#1f2937",
      ":hover": {
        backgroundColor: "#84cc16",
        color: "#1f2937",
      },
    }),
    input: (provided) => ({
      ...provided,
      color: "#f3f4f6",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1f2937",
      borderColor: "#374151",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#f3f4f6",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CustomHelmet
        title="FitForge - Add Slot"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      <div className="mb-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-2">
          <MdSchedule className="text-3xl text-lime-400" />
          <h1 className="text-3xl font-bold text-lime-400">
            Add New Training Slots
          </h1>
        </div>
        <p className="text-gray-400 text-center">
          Add new availability to your training schedule
        </p>
      </div>

      {/* Trainer Profile */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
        <h2 className="text-xl font-bold text-lime-400 mb-4 flex items-center gap-2">
          <FaUserTie className="text-lime-400" />
          Your Trainer Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <div className="text-gray-400 mb-1 flex items-center gap-2">
                <MdPerson className="text-gray-400" />
                Name
              </div>
              <div className="text-gray-200">{trainerApp?.name}</div>
            </div>

            <div className="mb-4">
              <div className="text-gray-400 mb-1 flex items-center gap-2">
                <MdEmail className="text-gray-400" />
                Email
              </div>
              <div className="text-gray-200">{trainerData?.email}</div>
            </div>

            <div className="mb-4">
              <div className="text-gray-400 mb-1 flex items-center gap-2">
                <MdWorkHistory className="text-gray-400" />
                Experience
              </div>
              <div className="text-gray-200">
                {trainerApp?.experience} years
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <div className="text-gray-400 mb-1 flex items-center gap-2">
                <MdSchool className="text-gray-400" />
                Certifications
              </div>
              <div className="text-gray-200">{trainerApp?.certifications}</div>
            </div>

            <div className="mb-4">
              <div className="text-gray-400 mb-1 flex items-center gap-2">
                <MdFitnessCenter className="text-gray-400" />
                Skills
              </div>
              <div className="text-gray-200">
                {trainerApp?.skills?.join(", ")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Slots */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
        <h2 className="text-xl font-bold text-lime-400 mb-4 flex items-center gap-2">
          <MdSchedule className="text-lime-400" />
          Your Current Availability
        </h2>

        {existingSlots.length === 0 ? (
          <p className="text-gray-400">No slots added yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {existingSlots.map((slot, index) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-lg border border-gray-600"
              >
                <div className="font-medium text-gray-200">{slot.day}</div>
                <div className="text-gray-400">{slot.time}</div>
                {slot.className && (
                  <div className="mt-2 text-xs bg-lime-400/10 text-lime-400 inline-block px-2 py-1 rounded">
                    {slot.className}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Slots Form */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-lime-400 mb-4 flex items-center gap-2">
          <MdAddCircleOutline className="text-lime-400" />
          Add New Slots
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Day Selection */}
            <div>
              <label className="text-gray-300 mb-2 flex items-center gap-2">
                <MdCalendarToday className="text-gray-300" />
                Select Days
              </label>
              <Select
                isMulti
                options={availableDays}
                value={selectedDays}
                onChange={setSelectedDays}
                placeholder="Select days..."
                isSearchable
                className="react-select-container"
                classNamePrefix="react-select"
                closeMenuOnSelect={false}
                styles={customStyles}
              />
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="text-gray-300 mb-2 flex items-center gap-2">
                <MdAccessTime className="text-gray-300" />
                Select Time Slots
              </label>
              <Select
                isMulti
                options={availableTimes}
                value={selectedTimes}
                onChange={setSelectedTimes}
                placeholder="Select time slots..."
                className="react-select-container text-gray-900"
                classNamePrefix="react-select"
                closeMenuOnSelect={false}
                styles={customStyles}
              />
            </div>
          </div>

          {/* Class Selection */}
          <div>
            <label className="text-gray-300 mb-2 flex items-center gap-2">
              <MdClass className="text-gray-300" />
              Associated Class (Optional)
            </label>
            <Select
              options={classOptions}
              value={selectedClass}
              onChange={setSelectedClass}
              placeholder="Select a class..."
              isClearable
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
              noOptionsMessage={() => "No classes match your skills"}
              styles={customStyles}
            />
            <p className="text-gray-400 text-sm mt-1">
              Only classes matching your skills are shown
            </p>
          </div>

          {/* Slot Preview */}
          {selectedDays.length > 0 && selectedTimes.length > 0 && (
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="text-lg font-medium text-lime-400 mb-2">
                Slots to be Added
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedDays.map((day) =>
                  selectedTimes.map((time) => (
                    <div
                      key={`${day.value}-${time.value}`}
                      className="bg-gray-600 p-2 rounded text-sm"
                    >
                      <div className="font-medium">{day.value}</div>
                      <div className="text-gray-300">{time.value}</div>
                      {selectedClass && (
                        <div className="text-xs text-lime-400 mt-1">
                          {selectedClass.label}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <p className="text-gray-400 text-sm mt-2">
                {selectedDays.length * selectedTimes.length} slot(s) will be
                added
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                selectedDays.length === 0 ||
                selectedTimes.length === 0
              }
              className={`w-full ${
                isSubmitting
                  ? "bg-lime-600 cursor-not-allowed"
                  : "bg-lime-400 hover:bg-lime-500 cursor-pointer"
              } text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
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
                  Adding Slots...
                </>
              ) : (
                <>
                  <MdAddCircleOutline className="text-lg" />
                  <span>Add New Slots</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSlot;
