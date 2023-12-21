import { Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Search from "./pages/Restraunts";
import RestrauntDetail from "./pages/Restraunts/RestrauntDetailPage";
import Footer from "./components/common/Footer";
import Reservation from "./pages/Restraunts/Reservation";
import ReservationStatus from "./pages/Restraunts/Reservation/ReservationStatus";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<h1>About</h1>} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/restraunts" element={<Search />} />
        <Route path="/restaurant-detail" element={<RestrauntDetail />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/reservation-status" element={<ReservationStatus />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
