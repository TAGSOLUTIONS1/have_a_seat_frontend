import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "@/pages/Landing/footer/Footer";
export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />

    </>
  );
}
