import { useState, useEffect, useRef } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { cn } from "@/lib/utils";
import { LucideLoader, User, History, Bell, LogOut } from "lucide-react";
import SideNav from "../SideNav";
import NotificationBell from "../NotificationBell";
import "./nav.css";
import { navLinks } from "@/components/constants/constants";
import { getCurrentTime, initialBookingState } from "@/components/constants/constants";
import { getCurrentDate } from "@/lib/utils";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, authState } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      logout();
      setShowTooltip(false);
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
  };

  const toggleTooltip = () => {
    setShowTooltip((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleDocumentClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [showTooltip]);

  const [formData, setFormData] = useState({
      attributes: "reservation",
      reservation_covers: 2,
      persons: 2,
      reservation_date: getCurrentDate(),
      date: getCurrentDate(),
      reservation_time: getCurrentTime(),
      location: "",
      term: "",
    });

   const handleSearch = () => {
      let route;
      if (!formData.location) {
        localStorage.setItem(
          "searchFormData",
          JSON.stringify(initialBookingState)
        );
        route = `/restraunts?data=${encodeURIComponent(
          JSON.stringify(initialBookingState)
        )}`;
      } else {
        localStorage.setItem("searchFormData", JSON.stringify(formData));
        route = `/restraunts?data=${encodeURIComponent(
          JSON.stringify(formData)
        )}`;
      }
      console.log("rote is " , route)
      navigate(route);
    };

  return (
    <>
      <nav className="sticky top-2 start-0 px-2 sm:px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-4 z-20">
        <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto backdrop-blur-navigation px-5 rounded-full">
          <div className="flex items-center rtl:space-x-reverse p-2">
            <Link className="flex" to="/">
              <img
                src="/assets/haveaseatlogo.png"
                className="h-16 w-20 sm:h-16 sm:w-auto md:h-20 md:w-auto"
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
                          className={cn("rounded-full border border-plum text-base font-agrandir font-bold")}
                          variant="outline"
                          asChild
                        >
                          <Link to="/login" className="text-plum text-base font-agrandir font-bold">
                            Sign In
                          </Link>
                        </Button>
                      </li>
                      <hr className="border-gray-200" />
                      <li className="p-4">
                        <button className="rounded-full bg-plum text-base text-center text-white font-agrandir font-bold px-5 p-2"
                        onClick={handleSearch}>
                          Book a Table
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <ul className="flex">
                      <li className="p-4">
                        <Button
                          className={cn("rounded-full bg-plum")}
                          asChild
                        >
                          <Link to="/user-history">Reservations</Link>
                        </Button>
                      </li>
                    </ul>
                    
                    {/* Notification Bell */}
                    <div className="flex items-center">
                      <NotificationBell />
                    </div>
                    
                    <div
                      ref={dropdownRef}
                      className="relative flex items-center gap-2 tooltip-trigger"
                    >
                      <button
                        onClick={toggleTooltip}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-plum focus:ring-offset-2 rounded-full p-1"
                      >
                        <img
                          src="/assets/tooltip.png"
                          alt="User avatar"
                          className="w-10 h-10 rounded-full cursor-pointer border-2 border-plum/20"
                        />
                        <span className="cursor-pointer font-medium text-gray-700">
                          {authState.user?.first_name}
                        </span>
                      </button>
                      {showTooltip && (
                        <div className="user-dropdown absolute top-14 right-0 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden w-56 z-50">
                          {/* User Info Section */}
                          <div className="px-4 py-3 bg-gradient-to-r from-plum/10 to-purple-50 border-b border-gray-100">
                            <p className="font-semibold text-gray-900 text-sm">
                              {authState.user?.first_name} {authState.user?.last_name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {authState.user?.email}
                            </p>
                          </div>
                          
                          {/* Menu Items */}
                          <ul className="py-2">
                            <li>
                              <Link
                                to="/user-profile"
                                onClick={() => setShowTooltip(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-plum transition-colors duration-150 group"
                              >
                                <User className="w-5 h-5 text-gray-400 group-hover:text-plum transition-colors" />
                                <span className="font-medium">Profile Insights</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/user-history"
                                onClick={() => setShowTooltip(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-plum transition-colors duration-150 group"
                              >
                                <History className="w-5 h-5 text-gray-400 group-hover:text-plum transition-colors" />
                                <span className="font-medium">History</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/notifications"
                                onClick={() => setShowTooltip(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-plum transition-colors duration-150 group"
                              >
                                <Bell className="w-5 h-5 text-gray-400 group-hover:text-plum transition-colors" />
                                <span className="font-medium">Notifications</span>
                              </Link>
                            </li>
                          </ul>
                          
                          {/* Divider */}
                          <div className="border-t border-gray-100"></div>
                          
                          {/* Logout */}
                          <div className="py-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                            >
                              <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" />
                              <span className="font-medium">Logout</span>
                            </button>
                          </div>
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
