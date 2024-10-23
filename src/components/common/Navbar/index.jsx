import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { cn } from "@/lib/utils";
import { LucideLoader, User } from "lucide-react";
import SideNav from "../SideNav";
import "./nav.css";

const Navbar = () => {
  const { logout, authState } = useAuth();
  const storageToken = localStorage.getItem("accessToken");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 start-0 px-0 sm:px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-4 z-20">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
          <div className="flex items-center rtl:space-x-reverse">
            <Link className="flex" to="/">
              <img
                src="/assets/static_logo.png"
                className="h-16 w-24 sm:h-20 sm:w-24  md:h-20 md:w-32"
                alt="have A seat Logo"
              />
              <span className="text-3xl self-center italic sm:text-4xl text-purple-600 font-semibold whitespace-nowrap custom-font">
                Have a Seat
              </span>
            </Link>
          </div>
          <SideNav />
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            {authState?.loading ? (
              <LucideLoader className="w-6 h-6 mr-2 animate-spin" />
            ) : (
              <div className="relative">
                {!authState.isAuthenticated && !authState.user ? (
                  <div className="flex">
                    <ul className="flex ">
                      <li className="p-4">
                        <Button
                          className={cn("rounded-full ")}
                          variant="outline"
                          asChild
                        >
                          <Link to="/login">Login</Link>
                        </Button>
                      </li>
                      <hr className="border-gray-200" />
                      <li className="p-4">
                        <Button className={cn("rounded-full")} asChild>
                          <Link to="/register">Register</Link>
                        </Button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <div>
                      <ul className="flex">
                        <li className="pt-5 pr-2 mt-2 decoration-solid text-purple-600 text-sm">
                          {authState.user?.email}
                        </li>
                        <li className="pt-4">
                          <Button
                            className={cn("rounded-full bg-purple-600 ")}
                            asChild
                            onClick={handleLogout}
                          >
                            <Link to="/">Logout</Link>
                          </Button>
                        </li>
                        <li className="p-4">
                          <Button
                            className={cn("rounded-full bg-purple-600 ")}
                            asChild
                          >
                            <Link to="/user-history">Reservations</Link>
                          </Button>
                        </li>
                      </ul>
                    </div>
                    <div className="relative w-[12%] h-[10%] mt-4 bg-purple-600 rounded-full p-2">
                      <Link to="account-links">
                        <User className="cursor-pointer text-white w-6 h-6" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
