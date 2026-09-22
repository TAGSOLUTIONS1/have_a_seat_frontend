import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/contexts/authContext/AuthProvider";
import { User, History, Bell, LogOut, Gift, Heart, Search, ArrowLeft } from "lucide-react";
import GeoApiAuto from "@/components/home/HomeAutoComplete";
import { MdLocationOn } from "react-icons/md";
import {
  FooterLinks,
  initialBookingState,
  socialMediaLinks,
} from "@/components/constants/constants";

// Simple armchair icon SVG component - minimal line art style facing right
const ArmchairIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
  >
    {/* Simple armchair/sofa facing right - minimal design */}
    <path d="M3 10h14v6H3z" />
    <path d="M3 13h14" />
    <path d="M5 10V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3" />
    <path d="M5 16v2M9 16v2M13 16v2" />
  </svg>
);

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SideNav = () => {
  const { logout, authState } = useAuth();
  const navigate = useNavigate();
  // Show menu directly if logged in, otherwise show search
  const [currentScreen, setCurrentScreen] = useState(
    authState.isAuthenticated && authState.user ? "menu" : "search"
  );
  const [location, setLocation] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Load saved location from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("searchFormData");
    if (savedData) {
      try {
        const formData = JSON.parse(savedData);
        if (formData.location) {
          setLocation(formData.location);
        }
      } catch (e) {
        console.error("Error parsing saved form data:", e);
      }
    }
  }, []);

  // Update screen when authentication state changes
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      setCurrentScreen("menu");
    } else {
      setCurrentScreen("search");
    }
  }, [authState.isAuthenticated, authState.user]);

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentScreen("search"); // Reset to search screen after logout
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
  };

  const getLocationData = (value) => {
    const locationString = typeof value === 'string' ? value : value?.location || value;
    const firstWord = locationString.split(",")[0].trim();
    setLocation(firstWord);
  };

  const handleSearch = () => {
    if (!location.trim()) {
      return;
    }

    const formData = {
      location: location,
      reservation_date: new Date().toISOString().split('T')[0],
      date: new Date().toISOString().split('T')[0],
      reservation_time: new Date().toTimeString().slice(0, 5),
      persons: 2,
      reservation_covers: 2,
    };

    localStorage.setItem("searchFormData", JSON.stringify(formData));
    const route = `/restraunts?data=${encodeURIComponent(JSON.stringify(formData))}`;

    // Close sidebar before navigation
    setIsOpen(false);
    navigate(route);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center mx-2 p-1 w-10 h-10 justify-center text-sm text-plum border-0 rounded-lg md:hidden hover:bg-gray-100"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[85%] max-w-[420px] p-0 overflow-hidden bg-white/90 backdrop-blur-xl border-0 shadow-2xl"
      >
        {currentScreen === "search" ? (
          // Search Screen
          <div className="flex flex-col h-full">
            {/* Header with Logo and Brand */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3 mb-8">
                <div className="text-black">
                  <img src="/assets/haveaseatlogo.png" alt="Have a Seat Logo" className="w-10 h-10" />
                </div>
                <span className="text-xl font-semibold text-black">Have a Seat</span>
              </div>

              {/* Welcome Back Heading - Centered and Large */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-black">Welcome Back</h2>
                {authState.isAuthenticated && authState.user && (
                  <p className="text-sm text-gray-500 mt-2">
                    {authState.user?.first_name} {authState.user?.last_name}
                  </p>
                )}
              </div>

              {/* Authentication Buttons (if not logged in) - Styled like image */}
              {!authState.isAuthenticated && !authState.user && (
                <div className="flex gap-3 mb-6">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-3xl border border-gray-300 bg-white text-black hover:bg-gray-50 font-medium py-2 text-base"
                    asChild
                  >
                    <Link to="/login">Log In</Link>
                  </Button>
                  <Button
                    className="flex-1 rounded-3xl bg-plum hover:bg-purple-800 text-white font-medium py-2 text-base"
                    asChild
                  >
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Search Section */}
            <div className="flex flex-col gap-2  sm:items-stretch bg-white/95 backdrop-blur-sm rounded-2xl p-2 sm:p-1.5 sm:pr-1.5 sm:pl-2 md:pl-2 shadow-2xl border-2 border-white/60 ring-1 ring-plum/15 focus-within:ring-plum/35 transition-shadow overflow-visible mx-4">
              <div className="flex flex-1 min-w-0 items-center gap-2 sm:gap-3 py-1 sm:py-1.5 px-2 sm:px-0">
                <MdLocationOn
                  size={26}
                  color="#9235E2"
                  className="flex-shrink-0 sm:scale-110"
                  aria-hidden
                />
                <div className="flex-1 min-w-0 text-left relative">
                  <GeoApiAuto
                    getLocationData={getLocationData}
                    location={location}
                    placeholder="City, neighborhood, or address"
                  />
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="inline-flex items-center justify-center gap-2 rounded-xl  sm:min-h-[3rem] bg-plum text-white font-agrandir font-bold text-sm sm:text-base px-5 py-1 shadow-md hover:bg-plum/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none sm:shrink-0 w-full sm:w-auto border border-plum/30"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                Search
              </button>
            </div>
            {/* <p className="mt-3 text-xs sm:text-sm text-white/80 font-inter px-1">
              Pick a suggestion or enter a location, then tap Search (or press
              Enter).
            </p> */}
            <div className="mt-auto py-4 px-4">
              <div className=" border-t-2 border-black m-auto md:w-full">
                <div className="text-center md:text-left flex flex-col gap-4 md:gap-0 md:flex-row text-sm sm:text-base justify-between items-center py-5">
                  <div>
                    <p className=" ">Copyright © HaveaSeat. All rights reserved. </p>
                  </div>
                  <ul>
                    <li className="flex gap-[22px] ">
                      {socialMediaLinks.map((item, index) => (
                        <a
                          key={item}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <img src={item.icon} alt="" />
                        </a>
                      ))}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        ) : (
          // Menu Screen
          <div className="flex flex-col h-full">
            {/* Header with Back Button */}
            <div className="px-6 pt-8 pb-6 border-b border-gray-200 flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {/* <h2 className="text-xl font-bold text-plum">PROFILE</h2> */}
            </div>

            {/* User Info */}
            <div className="px-6 py-4 border-b border-gray-200">
              <p className="text-lg font-semibold text-gray-900">
                {authState.user?.first_name} {authState.user?.last_name}
              </p>
              <p className="text-sm text-gray-500">{authState.user?.email}</p>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="flex flex-col gap-1">
                <li>
                  <Link
                    to="/user-profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-plum transition-colors duration-150 rounded-lg group"
                  >
                    <User className="w-5 h-5 text-gray-400 group-hover:text-plum transition-colors" />
                    <span className="font-medium">Profile Insights</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/demographics"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-plum transition-colors duration-150 rounded-lg group"
                  >
                    <Gift className="w-5 h-5 text-gray-400 group-hover:text-plum transition-colors" />
                    <span className="font-medium">Demographics</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/favourites"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-plum transition-colors duration-150 rounded-lg group"
                  >
                    <Heart className="w-5 h-5 text-gray-400 group-hover:text-plum transition-colors" />
                    <span className="font-medium">Favourites</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user-history"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-plum transition-colors duration-150 rounded-lg group"
                  >
                    <History className="w-5 h-5 text-gray-400 group-hover:text-plum transition-colors" />
                    <span className="font-medium">Reservations</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/notifications"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-plum transition-colors duration-150 rounded-lg group"
                  >
                    <Bell className="w-5 h-5 text-gray-400 group-hover:text-plum transition-colors" />
                    <span className="font-medium">Notifications</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account-links"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-plum transition-colors duration-150 rounded-lg group"
                  >
                    <User className="w-5 h-5 text-gray-400 group-hover:text-plum transition-colors" />
                    <span className="font-medium">Account Links</span>
                  </Link>
                </li>

                {/* Divider */}
                <div className="border-t border-gray-200 my-2"></div>

                {/* Logout */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-150 rounded-lg group"
                  >
                    <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" />
                    <span className="font-medium">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SideNav;
