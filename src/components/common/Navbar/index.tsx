import { Link } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { fetchUserInfo } from "@/lib/utils";

import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/authContext/AuthProvider";

import SideNav from "../SideNav";
import "./nav.css";

const Navbar = () => {

  const { logout } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>();


  const storageToken = localStorage.getItem('accessToken');

  useEffect(() => {

    const token = localStorage.getItem('accessToken');
  
    const fetchUserInformation = async (userToken:any) => {
      try {
        const userInfo = await fetchUserInfo(userToken);
        setUser(JSON.parse(userInfo));
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    if (token) {
      fetchUserInformation(token);
    } else {
      console.log('Token not available yet.');
    }
  }, [storageToken]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleUserClick = (e: any) => {
    e.stopPropagation();
    toggleDropdown();
  };

  const handleLogout = async () => {
    try {
      await logout(); 
      setUser(null);
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
  }
  
  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 start-0 px-4 z-20">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
          <div className="flex items-center rtl:space-x-reverse">
            <Link to="/">
              <img
                src="/assets/static_logo.png"
                className="h-20 w-32"
                alt="have A seat Logo"
              />
            </Link>
            <span className="self-center italic text-4xl text-purple-600 font-semibold whitespace-nowrap custom-font">
              Have a Seat
            </span>
            {/* <div className="relative left-[750px]">
              <p className="text-purple-600 text-lg float-left">
                {user && user.email}
              </p>
            </div> */}
          </div>
          <SideNav />
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <div onClick={closeDropdown}>
              <div className="relative">
                <div className="relative bg-purple-600 rounded-full p-2">
                  <User
                    onClick={handleUserClick}
                    className="cursor-pointer text-white w-6 h-6"
                  />
                </div>
                {isDropdownOpen && (
                  <ul className="font-medium absolute top-full right-0 mt-4 border border-gray-100 rounded-lg bg-gray-50">
                    {user === undefined || user === null ? (
                      <>
                        <li className="p-4">
                          <Button
                            className={cn("rounded-full ml-2")}
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
                      </>
                    ) : (
                      <li className="p-4">
                        <Button
                          className={cn("rounded-full")}
                          asChild
                          onClick={handleLogout}
                        >
                          <Link to="/">Logout</Link>
                        </Button>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
