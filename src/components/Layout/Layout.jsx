import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
