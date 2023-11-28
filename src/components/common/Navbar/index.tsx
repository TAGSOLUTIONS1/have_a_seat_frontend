import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import SideNav from "../SideNav";

const Navbar = () => {
  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky w-full z-20 top-0 start-0 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto ">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="/assets/static_logo.png"
              className="h-20 w-32"
              alt="have A seat Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap">
              Have a Seat
            </span>
          </a>
          <SideNav />
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
              <li>
                <Button className={cn(`rounded-full`)} asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </li>
              <li>
                <Button
                  className={cn(`rounded-full`)}
                  variant="outline"
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
