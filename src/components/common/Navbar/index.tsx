import { Link } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import "./nav.css";
import axios from "axios";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import { cn } from "@/lib/utils";
import SideNav from "../SideNav";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/authContext/AuthProvider";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {authState}=useAuth();
  const [user, setUser] = useState<any>()

   const fetchUserInfo = async (token: string) => {
    try {
      if (!token) {
        throw new Error('Access token not found');
      }

      type JwtPayload = {
        user_id: string; 
      };
  
    const decodedToken = jwtDecode(token) as JwtPayload;
    console.log(decodedToken)
  
    let userId: string | null = null;
  
  if (decodedToken && decodedToken?.user_id) {
    userId = decodedToken.user_id;
    console.log('User ID:', userId);
  } else {
    console.log('User ID not available in the decoded token.');
  }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const {data}= await axios.get(
        `https://tagsolutionsltd.com/auth/viewuser/${userId}/`,
        config
      );
  
      console.log(data?.data )
      setUser(data?.data)
  
      return  data.data ;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    if (authState.accessToken) {
      const token: string = authState.accessToken; 
      fetchUserInfo(token);
    }
  }, [authState.accessToken]);

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

  console.log(user)
  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky w-full z-20 top-0 start-0 px-4">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto ">
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
          </div>
          <SideNav />
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <div onClick={closeDropdown}>
              <div className="relative">
                <p className="text-black">
                {user && user.email} 
                </p>
                <div className="relative bg-purple-600 rounded-full p-2">
                  <User
                    onClick={handleUserClick}
                    className="cursor-pointer text-white w-6 h-6"
                  />
                </div>
                {isDropdownOpen && (
                  <ul className="font-medium absolute top-full right-0 mt-4 border border-gray-100 rounded-lg bg-gray-50">
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
