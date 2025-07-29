import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "./StripePaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const PaymentFormContainer = ({
  trainer,
  slot,
  package: packageName,
  price,
  user,
  classId,
  trainerId,
  _id,
  paymentStatus,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Payment Details</h2>

      <div className="bg-gray-700 p-6 rounded-lg">
        <Elements stripe={stripePromise}>
          <StripePaymentForm
            trainer={trainer}
            day={slot.day}
            time={slot.time}
            packageName={packageName}
            price={price}
            user={user}
            classId={classId}
            trainerId={trainerId}
            _id={_id}
            paymentStatus={paymentStatus}
          />
        </Elements>
      </div>

      <div className="text-gray-400 text-sm">
        <p>
          Your payment is secured with Stripe. We don't store your card details.
        </p>
      </div>
    </div>
  );
};

export default PaymentFormContainer;
