import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { cn } from "@/lib/utils";
import { LucideLoader } from "lucide-react";
import SideNav from "../SideNav";
import "./nav.css";
import { navLinks } from "@/components/constants/constants";

const Navbar = () => {
  const { logout, authState } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
  };

  const toggleTooltip = () => {
    setShowTooltip((prev) => !prev);
  };

  const handleDocumentClick = (event) => {
    if (!event.target.closest(".tooltip-trigger")) {
      setShowTooltip(false);
    }
  };

  // Add and clean up the event listener
  useState(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <>
      <nav className="bg-bgGray sticky top-0 start-0 px-0 sm:px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-4 z-20">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
          <div className="flex items-center rtl:space-x-reverse">
            <Link className="flex" to="/">
              <img
                src="/assets/static_logo.png"
                className="h-16 w-24 sm:h-20 sm:w-24 md:h-20 md:w-32"
                alt="Have A Seat Logo"
              />
            </Link>
          </div>
          <SideNav />

          <ul className="hidden lg:flex gap-10">
            {navLinks.map((link, index) => (
              <a href={link.to}><li key={index} className="font-agrandir font-medium text-lg cursor-pointer">
              {link.label}
            </li></a>
            ))}
          </ul>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            {authState?.loading ? (
              <LucideLoader className="w-6 h-6 mr-2 animate-spin" />
            ) : (
              <div className="relative">
                {!authState.isAuthenticated && !authState.user ? (
                  <div className="flex">
                    <ul className="flex">
                      <li className="p-4">
                        <Button
                          className={cn("rounded-full border border-plum")}
                          variant="outline"
                          asChild
                        >
                          <Link to="/login" className="text-plum">
                            Login
                          </Link>
                        </Button>
                      </li>
                      <hr className="border-gray-200" />
                      <li className="p-4">
                        <Button className={cn("rounded-full")} asChild>
                          <Link to="/register">Register Now</Link>
                        </Button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <ul className="flex">
                      <li className="p-4">
                        <Button
                          className={cn("rounded-full bg-purple-600")}
                          asChild
                        >
                          <Link to="/user-history">Reservations</Link>
                        </Button>
                      </li>
                    </ul>
                    <div
                      className="relative flex items-center gap-2 tooltip-trigger"
                      onClick={toggleTooltip} // Toggle on click
                    >
                      <img
                        src="/assets/tooltip.png"
                        alt=""
                        className="w-10 h-10 rounded-full cursor-pointer"
                      />
                      <span className="cursor-pointer">
                        {authState.user?.first_name}
                      </span>
                      {showTooltip && (
                        <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-4 w-48">
                          <ul className="space-y-2">
                            <li>
                              <Link
                                to="/user-profile"
                                className="block w-full text-gray-700 hover:text-purple-600"
                              >
                                Profile
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/user-history"
                                className="block w-full text-gray-700 hover:text-purple-600"
                              >
                                History
                              </Link>
                            </li>
                            <li>
                              <button
                                onClick={handleLogout}
                                className="w-full text-left text-gray-700 hover:text-purple-600"
                              >
                                Logout
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
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
