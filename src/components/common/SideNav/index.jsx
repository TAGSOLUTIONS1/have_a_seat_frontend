import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/contexts/authContext/AuthProvider";
import { cn } from "@/lib/utils";
import { User, History, Bell, LogOut, Gift, Heart } from "lucide-react";

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

  // Handle avatar URL from backend - construct full URL if needed
  const getAvatarUrl = () => {
    if (!authState?.user?.avatar_url) {
      return "https://bootdey.com/img/Content/avatar/avatar7.png";
    }
    
    // If avatar_url is already a full URL, use it
    if (authState.user.avatar_url.startsWith('http')) {
      return authState.user.avatar_url;
    }
    
    // If it's a relative path, construct full URL
    return `https://have-a-seatonline.com/${authState.user.avatar_url}`;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center mx-2 p-1 w-10 h-10 justify-center text-sm text-plum border-0 rounded-lg md:hidden hover:bg-gray-100  "
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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>User Authentication</SheetTitle>
          <SheetDescription>{/* Login or Signup here  */}</SheetDescription>
        </SheetHeader>
        <div className=" justify-center text-center align-middle items-center w-full">
          <div className="flex justify-center text-center align-middle items-center">
            <img
              src={authState?.user ? getAvatarUrl() : "https://bootdey.com/img/Content/avatar/avatar7.png"}
              alt="Admin"
              className="rounded-circle object-cover"
              width="150"
              height="150"
              onError={(e) => {
                e.target.src = "https://bootdey.com/img/Content/avatar/avatar7.png";
              }}
            />
          </div>
          <div className="relative">
            {!authState.isAuthenticated && !authState.user ? (
              <div className="fle mt-8">
                <ul className="flex ">
                  <li className="p-2">
                    <Button
                      className={cn("rounded-full ml-2")}
                      variant="outline"
                      asChild
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                  </li>
                  <hr className="border-gray-200" />
                  <li className="p-2">
                    <Button className={cn("rounded-full")} asChild>
                      <Link to="/register">Register</Link>
                    </Button>
                  </li>
                </ul>
              </div>
            ) : (
                <div className="w-full">
                  <ul>
                    <li className="p-4 text-center mt-2 decoration-solid text-purple-600 text-sm">
                      {authState.user?.first_name} {authState.user?.last_name}
                    </li>
                    <li className="p-2 text-center text-xs text-gray-500">
                      {authState.user?.email}
                    </li>
                  </ul>
                  <ul className="flex flex-col w-full gap-2 mt-4 px-4">
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
            )}
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            {/* <Button type="submit">Save changes</Button> */}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SideNav;
