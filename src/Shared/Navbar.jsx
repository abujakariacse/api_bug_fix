import { useContext, useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import {
  FaHome,
  FaDumbbell,
  FaUsers,
  FaComments,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { Link, NavLink } from "react-router";
import { AiFillDashboard } from "react-icons/ai";
import { AuthContext } from "../Provider/AuthProvider";
import toastMessage from "../utils/toastMessage";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const publicLinks = (
    <>
      <li>
        <NavLink
          to="/"
          onClick={handleMobileLinkClick}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-lime-400/20 text-lime-400 font-medium"
                : "text-white hover:bg-white/10"
            }`
          }
        >
          <FaHome className="text-lg" />
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/trainers"
          onClick={handleMobileLinkClick}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-lime-400/20 text-lime-400 font-medium"
                : "text-white hover:bg-white/10"
            }`
          }
        >
          <FaUsers className="text-lg" />
          Trainers
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/classes"
          onClick={handleMobileLinkClick}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-lime-400/20 text-lime-400 font-medium"
                : "text-white hover:bg-white/10"
            }`
          }
        >
          <FaDumbbell className="text-lg" />
          Classes
        </NavLink>
      </li>
      {user && user?.email && (
        <li>
          <NavLink
            to="/dashboard"
            onClick={handleMobileLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-lime-400/20 text-lime-400 font-medium"
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <AiFillDashboard className="text-lg" />
            Dashboard
          </NavLink>
        </li>
      )}
      <li>
        <NavLink
          to="/community"
          onClick={handleMobileLinkClick}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-lime-400/20 text-lime-400 font-medium"
                : "text-white hover:bg-white/10"
            }`
          }
        >
          <FaComments className="text-lg" />
          Community
        </NavLink>
      </li>
    </>
  );

  const handleLogout = () => {
    logOut()
      .then(() => {
        toastMessage("Logout Successful", "success");
      })
      .catch((error) => {
        error && toastMessage("Failed to log out. Please try again.", "error");
      });
  };

  const authLinks = (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <Link to={"/dashboard"}>
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-lime-400"
                title={user.displayName || "User"}
              />
            ) : (
              <FaUserCircle className="text-lime-400" size={40} />
            )}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-lime-400 text-lime-400 hover:bg-lime-400/10 transition-all cursor-pointer"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            onClick={handleMobileLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-lime-400 text-black font-medium"
                  : "border border-lime-400 text-lime-400 hover:bg-lime-400/10"
              }`
            }
          >
            <FaSignInAlt />
            Login
          </NavLink>
          <NavLink
            to="/register"
            onClick={handleMobileLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-lime-400 text-black font-medium"
                  : "bg-lime-400/10 text-lime-400 hover:bg-lime-400/20"
              }`
            }
          >
            <FaUserPlus />
            Register
          </NavLink>
        </>
      )}
    </div>
  );

  return (
    <nav className="fixed lg:top-3 left-0 right-0 z-50">
      <div className="lg:mx-auto max-w-screen-xl px-4 py-0.5 bg-white/20 lg:border lg:border-lime-900 backdrop-blur-lg lg:rounded-2xl shadow-md">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              className="w-28"
              src="https://i.ibb.co/qS1WNFv/Fit-Forge-Logo.png"
              alt="FitForge Logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-2">{publicLinks}</ul>

          <div className="hidden lg:flex">{authLinks}</div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-lime-400 p-2"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <ul className="flex flex-col gap-2 mb-4">{publicLinks}</ul>
            {authLinks}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
