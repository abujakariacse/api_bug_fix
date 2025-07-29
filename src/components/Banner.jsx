import { Link } from "react-router";
import { FaArrowRight } from "react-icons/fa";

const Banner = () => {
  return (
    <section className="relative h-[75vh] w-full overflow-hidden text-white border-b border-lime-950">
      {/* Video Background */}
      <video
        className="hidden lg:block absolute inset-0 w-full h-full object-cover"
        src="https://res.cloudinary.com/ddckuxsjx/video/upload/v1751962948/148202-793717935_small_qrzugd.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <video
        className="lg:hidden absolute inset-0 w-full h-full object-cover"
        src="https://res.cloudinary.com/ddckuxsjx/video/upload/v1751962499/148208-793717949_small_aond6i.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25  z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center h-full px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
          Train Harder, Live <span className="text-lime-400">Stronger</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
          Achieve your fitness goals with expert trainers, powerful tracking
          tools, and a vibrant community.
        </p>
        <Link
          to="/allClasses"
          className="inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-500 text-black font-semibold px-6 py-3 rounded-lg transition"
        >
          Explore Classes <FaArrowRight />
        </Link>
      </div>
    </section>
  );
};

export default Banner;
