import { Link } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import axios from "axios";

import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/authContext/AuthProvider";

import SideNav from "../SideNav";
import "./nav.css";

const Navbar = () => {

  const { logout } = useAuth();
  const [user, setUser] = useState();
  const storageToken = localStorage.getItem("accessToken");

  useEffect(() => {
    (async () => {
      const localToken = localStorage.getItem("accessToken");
      if (localToken) {
        await fetchUserInfo(localToken);
      }
    })();
  }, [storageToken]);

  const fetchUserInfo = async (localToken) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localToken}`,
        },
      };
      const response = await axios.get(
        "https://tagsolutionsltd.com/api/v1/users/me",
        config
      );
      if (response.status === 200) {
        console.log(response.data, "fetching id");
        setUser(response.data);
      } else {
        console.error(
          "Error fetching user data. Non-200 status code:",
          response.status
        );
        console.error(response.data);
      }
    } catch (error) {
      // console.error("Error occurred while fetching user id:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
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
                className="h-20 w-32"
                alt="have A seat Logo"
              />
              <span className="self-center italic text-4xl text-purple-600 font-semibold whitespace-nowrap custom-font">
                Have a Seat
              </span>
            </Link>
          </div>
          <SideNav />

          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <div className="relative">
              {user === undefined || user === null ? (
                <div className="flex">
                  <ul className="flex ">
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
                </div>
              ) : (
                <div className="flex space-x-2">
                  <div>
                    <ul className="flex">
                    <li className="p-4 mt-2 text-purple-600 text-lg">{user && user.email}</li>
                      <li className="p-4">
                        <Button
                          className={cn("rounded-full bg-purple-600 ")}
                          asChild
                          onClick={handleLogout}
                        >
                          <Link to="/">Logout</Link>
                        </Button>
                      </li>
                    </ul>
                  </div>
                  <div className="relative w-[40px] h-[40px] mt-4 bg-purple-600 rounded-full p-2">
                    <Link to="account-links">
                      <User className="cursor-pointer text-white w-6 h-6" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;
