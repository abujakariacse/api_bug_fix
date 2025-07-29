import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Authentications/Login";
import Register from "../pages/Authentications/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import Subscribers from "../pages/Admin/Subscribers";
import PrivateRoute from "../routes/PrivateRoute";
import AdminRoute from "../routes/AdminRoute";
import AllTrainers from "../pages/Admin/AllTrainers";
import TrainerApplications from "../pages/Admin/TrainerApplications";
import Balance from "../pages/Admin/Balance";
import AddClass from "../pages/Admin/AddClass";
import TrainerRoute from "../routes/TrainerRoute";
import ManageSlots from "../pages/Trainer/ManageSlots";
import AddSlot from "../pages/Trainer/AddSlot";
import AddForum from "../pages/Trainer/AddForum";
import AllClasses from "../pages/AllClasses/AllClasses";
import AllTrainersHome from "../pages/AllTrainers/AllTrainersHome";
import BeTrainer from "../pages/BeTrainer/BeTrainer";
import TrainerApplicationDetail from "../pages/Admin/TrainerApplicationDetail";
import TrainersDetails from "../pages/TrainersDetails/TrainersDetails";
import TrainerBookPage from "../pages/TrainerBookPage/TrainerBookPage";
import PaymentLayout from "../pages/Payment/PaymentLayout";
import DashboardHome from "../pages/DashboardHome/DashboardHome";
import ActivityLog from "../pages/Member/ActivityLog";
import MemberRoute from "../routes/MemberRoute";
import Profile from "../pages/Member/Profile";
import BookedTrainers from "../pages/Member/BookedTrainers";
import AdminTrainerRoute from "../routes/AdminTrainerRoute";
import AllForums from "../pages/AllForums/AllForums";
import ForumDetails from "../pages/ForumDetails/ForumDetails";
import Error from "../Shared/Error";
import Forbidden from "../pages/Forbidden/Forbidden";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/classes",
        Component: AllClasses,
      },
      {
        path: "/trainers",
        Component: AllTrainersHome,
      },
      {
        path: "/trainers/:id",
        Component: TrainersDetails,
      },
      {
        path: "beTrainer",
        element: (
          <PrivateRoute>
            <BeTrainer></BeTrainer>
          </PrivateRoute>
        ),
      },
      {
        path: "/book-trainer/:id",
        element: (
          <PrivateRoute>
            <TrainerBookPage></TrainerBookPage>
          </PrivateRoute>
        ),
      },
      {
        path: "/payment/:id",
        element: (
          <PrivateRoute>
            <PaymentLayout />
          </PrivateRoute>
        ),
      },
      {
        path: "/forums/:id",
        element: (
          <PrivateRoute>
            <ForumDetails></ForumDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/community",
        Component: AllForums,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DashboardHome></DashboardHome>
          </PrivateRoute>
        ),
      },
      // Admin Route
      {
        path: "subscribers",
        element: (
          <AdminRoute>
            <Subscribers></Subscribers>
          </AdminRoute>
        ),
      },
      {
        path: "allTrainers",
        element: (
          <AdminRoute>
            <AllTrainers></AllTrainers>
          </AdminRoute>
        ),
      },
      {
        path: "trainerApplications",
        element: (
          <AdminRoute>
            <TrainerApplications></TrainerApplications>
          </AdminRoute>
        ),
      },
      {
        path: "trainerApplications/:id",
        element: (
          <AdminRoute>
            <TrainerApplicationDetail></TrainerApplicationDetail>
          </AdminRoute>
        ),
      },
      {
        path: "balance",
        element: (
          <AdminRoute>
            <Balance></Balance>
          </AdminRoute>
        ),
      },
      {
        path: "addClass",
        element: (
          <AdminRoute>
            <AddClass></AddClass>
          </AdminRoute>
        ),
      },

      // Trainer Routes
      {
        path: "manageSlots",
        element: (
          <TrainerRoute>
            <ManageSlots></ManageSlots>
          </TrainerRoute>
        ),
      },
      {
        path: "addSlot",
        element: (
          <TrainerRoute>
            <AddSlot></AddSlot>
          </TrainerRoute>
        ),
      },
      // Member Routes
      {
        path: "activityLog",
        element: (
          <MemberRoute>
            <ActivityLog></ActivityLog>
          </MemberRoute>
        ),
      },
      {
        path: "bookedTrainer",
        element: (
          <MemberRoute>
            <BookedTrainers></BookedTrainers>
          </MemberRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <MemberRoute>
            <Profile></Profile>
          </MemberRoute>
        ),
      },

      // Shared Route
      {
        path: "addForum",
        element: (
          <AdminTrainerRoute>
            <AddForum></AddForum>
          </AdminTrainerRoute>
        ),
      },
    ],
  },
  {
    path: "forbidden",
    Component: Forbidden,
  },
  {
    path: "*",
    element: <Error />,
  },
]);

export default router;
