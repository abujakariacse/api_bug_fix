/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import useAuth from "../../Hooks/useAuth";
import PaymentSummary from "./PaymentSummary";
import PaymentFormContainer from "./PaymentFromContainer";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Shared/Loading";
import CustomHelmet from "../../Shared/CustomHelmet";

const PaymentLayout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: bookingDetails = {}, isLoading: bookingDataLoading } = useQuery(
    {
      queryKey: ["paymentData", id],
      queryFn: async () => {
        const res = await axiosSecure.get(`/users/paymentData/${id}`);
        return res.data;
      },
    }
  );
  if (bookingDataLoading) {
    return <Loading></Loading>;
  }
  // Validate required params
  if (
    !bookingDetails.trainer ||
    !bookingDetails.slot ||
    !bookingDetails.package ||
    !bookingDetails.price
  ) {
    navigate("/trainers");
    return null;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-12 pt-24 px-4"
    >
      <CustomHelmet
        title="FitForge - Payment"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-8 border border-lime-400/20">
          <h1 className="text-3xl font-bold text-lime-400 mb-8">
            Complete Your Payment
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PaymentSummary {...bookingDetails} user={user} />
            <PaymentFormContainer {...bookingDetails} user={user} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentLayout;
