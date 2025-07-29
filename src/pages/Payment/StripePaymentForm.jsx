/* eslint-disable no-unused-vars */
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toastMessage from "../../utils/toastMessage";
import PaymentSuccess from "./PaymentSuccess";

const StripePaymentForm = ({
  price,
  user,
  trainerId,
  _id,
  paymentStatus,
  trainer,
  day,
  time,
  packageName,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const bookingDetails = { trainer, day, time, packageName, price };
  bookingDetails.transactionId = _id;

  const priceInCents = parseFloat(price.split("$")[1]) * 100;
  const userName = user.displayName;
  const userEmail = user.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
      return;
    }

    try {
      // Create Payment Intent
      const res = await axiosSecure.post("/create-payment-intent", {
        priceInCents,
        trainerId,
      });

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: userName,
            email: userEmail,
          },
        },
      });

      if (result.error) {
        throw result.error;
      }

      if (result.paymentIntent.status === "succeeded") {
        toastMessage("Payment Successful", "success");
        setIsPaid(true);
        await handlePaymentSuccess(_id);
        setShowSuccessModal(true);
      }
    } catch (error) {
      toastMessage(
        error.message || "Payment failed. Please try again.",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentId) => {
    try {
      const response = await axiosSecure.patch(
        `/users/payment-status/${paymentId}`
      );

      if (
        response.data.message !==
        "Payment status updated and saved to paymentsCollection."
      ) {
        toastMessage("⚠️ Payment already updated or not found.", "warn");
      }
    } catch (error) {
      toastMessage("❌ Failed to update payment status.", "error");
      throw error;
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 relative">
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#fff",
                    "::placeholder": {
                      color: "#a0aec0",
                    },
                    iconColor: "#a0f0a0",
                  },
                  invalid: {
                    color: "#fa755a",
                    iconColor: "#fa755a",
                  },
                },
              }}
            />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div className="flex justify-between items-center pt-4">
            <div>
              <p className="text-gray-400">Total Amount</p>
              <p className="text-2xl font-bold text-lime-400">{price}</p>
            </div>

            <motion.button
              type="submit"
              disabled={
                !stripe || processing || paymentStatus === "paid" || isPaid
              }
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-lime-400 hover:bg-lime-500 disabled:text-white
              disabled:bg-gray-600 text-gray-900 font-bold py-3 px-8 rounded-lg transition-all cursor-pointer"
            >
              {processing
                ? "Processing..."
                : paymentStatus === "paid" || isPaid
                ? "Paid"
                : `Pay ${price}`}
            </motion.button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative"
            >
              <PaymentSuccess
                bookingDetails={bookingDetails}
                onClose={closeModal}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StripePaymentForm;
