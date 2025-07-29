import {
  FaUserAlt,
  FaCalendarDay,
  FaClock,
  FaBox,
  FaMoneyBillWave,
} from "react-icons/fa";

const PaymentSummary = ({
  trainer,
  slot,
  price,
  user,
  package: packageName,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Booking Summary</h2>

      <div className="space-y-4 bg-gray-700 p-6 rounded-lg">
        <SummaryItem
          icon={<FaUserAlt className="text-lime-400 text-lg" />}
          label="Trainer"
          value={trainer}
        />
        <SummaryItem
          icon={<FaCalendarDay className="text-lime-400 text-lg" />}
          label="Day"
          value={slot.day}
        />
        <SummaryItem
          icon={<FaClock className="text-lime-400 text-lg" />}
          label="Time"
          value={slot.time}
        />
        <SummaryItem
          icon={<FaBox className="text-lime-400 text-lg" />}
          label="Package"
          value={packageName}
        />
        <SummaryItem
          icon={<FaMoneyBillWave className="text-lime-400 text-lg" />}
          label="Amount"
          value={price}
        />
      </div>

      {/* User Info Section */}
      <div className="space-y-4 bg-gray-700 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-lime-400">Your Information</h3>
        <SummaryItem label="Name" value={user?.displayName || "Not provided"} />
        <SummaryItem label="Email" value={user?.email || "Not provided"} />
      </div>
    </div>
  );
};

const SummaryItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    {icon && icon}
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  </div>
);

export default PaymentSummary;
