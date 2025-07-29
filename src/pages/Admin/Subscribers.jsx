import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Shared/Loading";
import { FiMail, FiUser, FiClock } from "react-icons/fi";
import { FaRegChartBar } from "react-icons/fa";
import { MdOutlineFitnessCenter } from "react-icons/md";
import CustomHelmet from "../../Shared/CustomHelmet";

const Subscribers = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: subscribers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["newsletterUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/newsletter");
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return (
      <div className="text-red-500 text-center mt-8">
        Failed to load subscribers
      </div>
    );
  }

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-lg">
      <CustomHelmet
        title="FitForge - Subscribers"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-lime-400 flex items-center gap-3">
            <MdOutlineFitnessCenter className="text-2xl" />
            Fitness Newsletter Subscribers
          </h2>
          <p className="text-gray-400 mt-2">
            Your community of fitness enthusiasts
          </p>
        </div>
        <div className="bg-gray-800 px-4 py-3 rounded-lg flex items-center gap-3">
          <FaRegChartBar className="text-lime-400 text-lg" />
          <span className="text-white font-medium">
            Total: {subscribers.length}{" "}
            {subscribers.length === 1 ? "Subscriber" : "Subscribers"}
          </span>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full min-w-2xl">
          <thead className="bg-gray-800">
            <tr>
              <th className="py-4 px-6 text-left text-gray-300 font-medium">
                <div className="flex items-center gap-2">
                  <FiUser className="text-lime-400" />
                  Name
                </div>
              </th>
              <th className="py-4 px-6 text-left text-gray-300 font-medium">
                <div className="flex items-center gap-2">
                  <FiMail className="text-lime-400" />
                  Email Address
                </div>
              </th>
              <th className="py-4 px-6 text-left text-gray-300 font-medium">
                <div className="flex items-center gap-2">
                  <FiClock className="text-lime-400" />
                  Subscription Date
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {subscribers.length > 0 ? (
              subscribers.map((subscriber) => (
                <tr
                  key={subscriber._id}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-4 px-6 text-gray-300">
                    {subscriber.name || "Anonymous Fitness Enthusiast"}
                  </td>
                  <td className="py-4 px-6 text-lime-400 ">
                    <div className="flex items-center gap-2">
                      <FiMail className="text-sm" />
                      {subscriber.email}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-400 flex items-center gap-2">
                    <FiClock className="text-sm" />
                    {formatDate(subscriber.subscribedAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FiMail className="text-4xl mb-3 text-gray-600" />
                    <p>No subscribers yet</p>
                    <p className="text-sm mt-1">
                      Your fitness community will grow soon!
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stats Footer */}
      <div className="mt-6 text-sm text-gray-400 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-lime-400"></span>
          <span>Active subscribers: {subscribers.length}</span>
        </div>
        {subscribers.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-600"></span>
            <span>
              Newest member: {formatDate(subscribers[0].subscribedAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscribers;
