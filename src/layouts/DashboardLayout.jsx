/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../Provider/AuthProvider";
import { Tooltip } from "react-tooltip";
import {
  FiHome,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiMail,
  FiUsers,
  FiUserPlus,
  FiPlusSquare,
  FiBarChart2,
  FiCalendar,
  FiPlusCircle,
  FiMessageSquare,
  FiList,
  FiUserCheck,
} from "react-icons/fi";
import { RiDashboardLine } from "react-icons/ri";
import toastMessage from "../utils/toastMessage";
import { ToastContainer } from "react-toastify";

// if the query doesn't work use ir
import useEffectRole from "../Hooks/useEffectRole";

import useUserRole from "../Hooks/useUserRole";

const DashboardLayout = () => {
  const { user, logOut, loading } = useContext(AuthContext);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const location = useLocation();

  const { role, roleLoading } = useUserRole();

  // If the query doesn't work
  // const { role, roleLoading } = useEffectRole();

  console.log({ role, roleLoading });

  const adminLinks = [
    {
      to: "/dashboard/subscribers",
      label: "Newsletter Subscribers",
      icon: <FiMail />,
    },
    {
      to: "/dashboard/allTrainers",
      label: "All Trainers",
      icon: <FiUsers />,
    },
    {
      to: "/dashboard/trainerApplications",
      label: "Trainer Applications",
      icon: <FiUserPlus />,
    },
    {
      to: "/dashboard/balance",
      label: "Balance Overview",
      icon: <FiBarChart2 />,
    },
    {
      to: "/dashboard/addClass",
      label: "Add Class",
      icon: <FiPlusSquare />,
    },
  ];

  const trainerLinks = [
    {
      to: "/dashboard/manageSlots",
      label: "Manage Slots",
      icon: <FiCalendar />,
    },
    {
      to: "/dashboard/addSlot",
      label: "Add Slot",
      icon: <FiPlusCircle />,
    },
  ];
  const sharedLinks = [
    {
      to: "/dashboard/addForum",
      label: "Add Forum",
      icon: <FiMessageSquare />,
    },
  ];
  const memberLinks = [
    {
      to: "/dashboard/activityLog",
      label: "Activity Log",
      icon: <FiList />,
    },
    {
      to: "/dashboard/bookedTrainer",
      label: "Booked Trainer",
      icon: <FiUserCheck />,
    },
    {
      to: "/dashboard/profile",
      label: "Profile",
      icon: <FiUser />,
    },
  ];

  const navLinks = [
    { to: "/", label: "Home", icon: <FiHome /> },
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <RiDashboardLine />,
    },
    ...(!roleLoading && role === "admin" ? adminLinks : []),

    ...(!roleLoading && role === "trainer" ? trainerLinks : []),

    ...(!roleLoading && role === "member" ? memberLinks : []),

    // ...(!roleLoading && role !== "member" ? sharedLinks : []),
  ];

  const currentPageTitle =
    navLinks.find((link) => link.to === location.pathname)?.label || "Dashboard";

  const UserAvatar = ({ size }) => {
    return (
      <div
        className={`rounded-full bg-gray-800 border-2 ${
          size === "md"
            ? "border-lime-400 w-12 h-12"
            : "border-gray-700 group-hover:border-lime-400 w-16 h-16"
        } overflow-hidden transition-colors`}
      >
        <img
          src={user?.photoURL || "https://i.pravatar.cc/150?img=3"}
          alt="User"
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  const handleLogout = () => {
    logOut()
      .then(() => {
        toastMessage("Logout Succefull", "success");
      })
      .catch((err) => {
        err && toastMessage("Something wen't wrongt please try again", "error");
      });
  };

  return (
    <div className="min-h-screen flex bg-gray-950 text-gray-100">
      {/* Mobile/Tablet Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/70 lg:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed z-40 w-72 min-h-screen bg-gray-900 border-r border-gray-800 shadow-2xl flex flex-col lg:hidden"
            >
              <div className="p-4 flex flex-col border-b border-gray-800 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar size="md" />
                    <div>
                      <h3 className="text-sm font-medium">{user?.displayName || "User"}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <FiMail className="text-xs" />
                        <span className="truncate max-w-[160px]">
                          {user?.email || "user@example.com"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 text-gray-400 hover:text-lime-400"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
              </div>

              <nav className="flex flex-col p-2 gap-1 flex-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <NavLink
                    end={link.to === "/dashboard"}
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-sm font-medium ${
                        isActive ? "bg-gray-800 text-lime-400" : "text-gray-300 hover:bg-gray-800"
                      }`
                    }
                  >
                    <span className="text-lg text-gray-400">{link.icon}</span>
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <div className="p-3 border-t border-gray-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-lime-400 cursor-pointer"
                >
                  <FiLogOut className="text-lg" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-20 xl:w-72 min-h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300">
        <div className="flex flex-col justify-center items-center">
          <Link to={"/"}>
            <img
              className="w-36 mt-4"
              src="https://i.ibb.co/qS1WNFv/Fit-Forge-Logo.png"
              alt="fitforge logo"
            />
          </Link>
          <div className="p-2 xl:p-6 flex flex-row items-center border-b border-gray-800 gap-2">
            <Link to="/dashboard/profile" className="group">
              <UserAvatar size="xl" />
            </Link>

            <div className="hidden xl:flex flex-col items-center text-center w-full">
              <h2 className="font-semibold truncate w-full">{user?.displayName || "Welcome"}</h2>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-200 w-full justify-center">
                <FiMail className="text-xs" />
                <span className="truncate max-w-[180px]">{user?.email || "user@example.com"}</span>
              </div>
              {role === "trainer" && (
                <div className="bg-lime-400 w-full text-black mt-1 text-xs px-2 py-1 rounded-full">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </div>
              )}

              {role === "admin" && (
                <div className="bg-lime-400 w-full text-black mt-1 text-xs px-2 py-1 rounded-full">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </div>
              )}
            </div>
          </div>
        </div>

        <nav className="flex flex-col p-2 xl:p-4 gap-1 flex-1 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              end={link.to === "/dashboard"}
              key={link.to}
              to={link.to}
              data-tooltip-id="sidebar-tooltip"
              data-tooltip-content={link.label}
              className={({ isActive }) =>
                `flex items-center justify-center xl:justify-start gap-3 px-2 xl:px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  isActive ? "bg-gray-800 text-lime-400" : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              <span className="text-xl">{link.icon}</span>
              <span className="hidden xl:inline">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            data-tooltip-id="sidebar-tooltip"
            data-tooltip-content="Logout"
            className="w-full flex items-center justify-center xl:justify-start gap-3 px-2 xl:px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-lime-400 cursor-pointer"
          >
            <FiLogOut className="text-xl" />
            <span className="hidden xl:inline">Logout</span>
          </button>
        </div>

        <Tooltip
          id="sidebar-tooltip"
          place="right"
          effect="solid"
          className="z-50 !bg-gray-800 !text-white !text-xs !py-1 !px-2 !rounded-md"
          offset={10}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-hidden">
        <header className="bg-gray-900 border-b border-gray-800 py-4 px-4 xl:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-lime-400"
            >
              <FiMenu className="text-xl" />
            </button>
            <h1 className="text-lg xl:text-xl font-semibold text-gray-100">{currentPageTitle}</h1>
          </div>
        </header>

        <div className="p-4 xl:p-6 h-[calc(100vh-65px)] overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default DashboardLayout;
