import erroranimation from "../assets/404Error.json";
import Lottie from "lottie-react";
import { Link } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import CustomHelmet from "./CustomHelmet";

const Error = () => {
  return (
    <div className="bg-slate-950 min-h-svh flex justify-center items-center">
      <CustomHelmet
        title="FitForge - Error"
        meta={[
          { name: "description", content: "Learn more about our website." },
          { property: "og:title", content: "About Us - My Website" },
        ]}
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center">
          <div>
            <Lottie
              style={{ maxWidth: "450px" }}
              animationData={erroranimation}
            ></Lottie>
          </div>
          <p className="mb-4 text-center text-white text-3xl">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2 bg-lime-600 hover:bg-lime-500 text-white rounded-full transition"
          >
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Error;
