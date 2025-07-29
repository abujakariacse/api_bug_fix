import Lottie from "lottie-react";
import noClass from "../assets/noClass.json";
import { RiSearchLine, RiFilterOffLine } from "react-icons/ri";

const NoClass = ({ hasFilters, onReset }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-6 py-12">
      <Lottie
        animationData={noClass}
        loop
        style={{ maxWidth: "350px", width: "100%" }}
      />

      <h2 className="text-3xl font-semibold text-red-400 text-center">
        {hasFilters ? "No matching classes found" : "No classes available"}
      </h2>

      <p className="text-slate-400 text-center max-w-md">
        {hasFilters
          ? "Try adjusting your search or filters. We couldn't find any classes that match your criteria."
          : "Check back later for new classes or contact support for more information."}
      </p>

      {hasFilters && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2 bg-lime-500 hover:bg-lime-600 text-gray-900 rounded-lg transition cursor-pointer"
        >
          <RiFilterOffLine />
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default NoClass;
