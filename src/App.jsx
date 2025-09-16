import { Route, Routes, useLocation } from "react-router-dom";

import VerifyUser from "./components/auth/SignupForm/VerifyUser";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";
import AccountLinks from "./pages/AccountLinks";
import ForgetPassword from "./pages/ForgetPassword";
import Protected from "./components/ProtectedRoutes";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Search from "./pages/Restraunts";
import Reservation from "./pages/Restraunts/Reservation";
import ReservationStatus from "./pages/Restraunts/Reservation/ReservationStatus";
import RestrauntDetail from "./pages/Restraunts/RestrauntDetailPage";
import Signup from "./pages/Signup";
import UserHistory from "./components/AccountLinking/UserHistory";
import UserStatistics from "./components/AccountLinking/UserStatistics";
import Landing from "./pages/Landing/Landing";
import MainLayout from "./components/Layout/Layout";
import RestaurantDetailsV2 from "./pages/Restraunts/ResturantDetailV2/RestaurantDetailsV2";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotificationsPage from "./pages/Notifications";
import '../public/assets/fonts/fonts.css';
import ChatBotWidget from "./components/ChatBotWidget";
import NotificationToast from "./components/common/NotificationToast";
import ResetPasswordOne from "./pages/ResetPasswordOne";

function App() {
  const location = useLocation();
  const showFooter =
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/forget" &&
    location.pathname !== "/resetpassword";
  return (
    <>
      <Routes>
        
        <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/reset-password" element={<ResetPasswordOne />} />
          <Route path="/forget" element={<ForgetPassword />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/verifyuser" element={<VerifyUser />} />
          <Route path="/restraunts" element={<Search />} />
          <Route path="/restaurant-detail" element={<RestrauntDetail />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/reservation-status" element={<ReservationStatus />} />
          <Route path="/user-history" element={<UserHistory />} />
          <Route path="/user-profile" element={<UserStatistics />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          {/* <Route path="/account-links" element={<Protected Component={<AccountLinks />} />} /> */}
          <Route path="/account-links" element={<Protected />}>
            <Route path="/account-links" element={<AccountLinks />} />
          </Route>
        </Route>
      </Routes>
      {/* {showFooter && <Footer />} */}

      <ChatBotWidget />
      <NotificationToast />
    </>
  );
}

export default App;
