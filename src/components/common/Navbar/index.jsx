import { useState, useEffect, useRef } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { cn } from "@/lib/utils";
import { LucideLoader, User, History, Bell, LogOut, Camera, Heart, Gift, Link as LinkIcon } from "lucide-react";
import SideNav from "../SideNav";
import NotificationBell from "../NotificationBell";
import "./nav.css";
import { navLinks } from "@/components/constants/constants";
import { getCurrentTime, initialBookingState } from "@/components/constants/constants";
import { getCurrentDate } from "@/lib/utils";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
const Navbar = () => {
  const navigate = useNavigate();
  const { logout, authState } = useAuth();
  const { toast } = useToast();
  const [showTooltip, setShowTooltip] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle avatar URL from backend - construct full URL if needed
  const getAvatarUrl = () => {
    // Use state avatar URL if available (for immediate update after upload)
    if (avatarUrl) {
      return avatarUrl;
    }
    
    if (!authState?.user?.avatar_url) {
      return "/assets/tooltip.png";
    }
    
    // If avatar_url is already a full URL, use it
    if (authState.user.avatar_url.startsWith('http')) {
      return authState.user.avatar_url;
    }
    
    // If it's a relative path, construct full URL
    return `https://have-a-seatonline.com/${authState.user.avatar_url}`;
  };

  // Update avatar URL when authState changes
  useEffect(() => {
    if (authState?.user?.avatar_url) {
      let url;
      if (authState.user.avatar_url.startsWith('http')) {
        url = authState.user.avatar_url;
      } else {
        url = `https://have-a-seatonline.com/${authState.user.avatar_url}`;
      }
      // Add timestamp to force refresh
      setAvatarUrl(`${url}?t=${Date.now()}`);
    } else {
      setAvatarUrl(null);
    }
  }, [authState?.user?.avatar_url]);

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

  const validateImageFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid image file (JPEG, PNG, GIF, or WEBP).",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    
    return true;
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateImageFile(file)) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = async () => {
        const maxDimension = 2048;
        if (img.width > maxDimension || img.height > maxDimension) {
          toast({
            title: "Image Too Large",
            description: "Please select an image with dimensions smaller than 2048x2048 pixels.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
        }
        
        // Upload the image
        await uploadAvatar(file);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const uploadAvatar = async (file) => {
    setUploading(true);
    try {
      const localToken = localStorage.getItem("accessToken");
      if (!localToken) {
        toast({
          title: "Authentication Error",
          description: "Please log in again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setUploading(false);
        return;
      }

      // Get user ID
      const userResponse = await axios.get(
        "https://have-a-seatonline.com/api/v1/users/me",
        {
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        }
      );

      if (!userResponse.data?.id) {
        throw new Error("User ID not found");
      }

      const userId = userResponse.data.id;

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload avatar
      const avatarResponse = await axios.post(
        `https://have-a-seatonline.com/api/v1/users/${userId}/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (avatarResponse.status === 200) {
        // Fetch updated user data immediately after upload
        const updatedUserResponse = await axios.get(
          "https://have-a-seatonline.com/api/v1/users/me",
          {
            headers: {
              Authorization: `Bearer ${localToken}`,
            },
          }
        );
        
        // Update localStorage with new user data
        if (updatedUserResponse.data) {
          localStorage.setItem("user", JSON.stringify(updatedUserResponse.data));
          
          // Update avatar URL immediately with cache-busting timestamp
          let newAvatarUrl;
          if (updatedUserResponse.data.avatar_url?.startsWith('http')) {
            newAvatarUrl = updatedUserResponse.data.avatar_url;
          } else if (updatedUserResponse.data.avatar_url) {
            newAvatarUrl = `https://have-a-seatonline.com/${updatedUserResponse.data.avatar_url}`;
          }
          
          if (newAvatarUrl) {
            // Add timestamp to force image refresh
            setAvatarUrl(`${newAvatarUrl}?t=${Date.now()}`);
          }
        }
        
        toast({
          title: "Profile Photo Updated",
          description: "Your profile photo has been updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        
        // Close the dropdown
        setShowTooltip(false);
        setUploading(false);
        
        // No page reload needed - avatar URL is updated in state
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload Failed",
        description: error.response?.status === 413 
          ? "File is too large. Please select a smaller image."
          : "Failed to upload avatar. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setUploading(false);
    }
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
                          src={getAvatarUrl()}
                          alt="User avatar"
                          className="w-10 h-10 rounded-full cursor-pointer border-2 border-plum/20 object-cover"
                          key={avatarUrl || authState?.user?.avatar_url}
                          onError={(e) => {
                            e.target.src = "/assets/tooltip.png";
                          }}
                        />
                        <span className="cursor-pointer font-medium text-gray-700">
                          {authState.user?.first_name}
                        </span>
                      </button>
                      {showTooltip && (
                        <div className="user-dropdown absolute top-14 right-0 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden w-56 z-50">
                          {/* User Info Section */}
                          <div className="px-4 py-3 bg-gradient-to-r from-plum/10 to-purple-50 border-b border-gray-100 relative">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm">
                                  {authState.user?.first_name} {authState.user?.last_name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {authState.user?.email}
                                </p>
                              </div>
                              <button
                                onClick={handleAvatarClick}
                                disabled={uploading}
                                className="ml-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 shadow-md transition-colors flex-shrink-0"
                                title="Change profile photo"
                                type="button"
                              >
                                {uploading ? (
                                  <LucideLoader className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Camera className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                              onChange={handleAvatarChange}
                              className="hidden"
                            />
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
                                to="/account-links"
                                onClick={() => setShowTooltip(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-plum transition-colors duration-150 group"
                              >
                                <LinkIcon className="w-5 h-5 text-gray-400 group-hover:text-plum transition-colors" />
                                <span className="font-medium">Linked Platforms</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/demographics"
                                onClick={() => setShowTooltip(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-plum transition-colors duration-150 group"
                              >
                                <Gift className="w-5 h-5 text-gray-400 group-hover:text-plum transition-colors" />
                                <span className="font-medium">Demographics</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/favourites"
                                onClick={() => setShowTooltip(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-plum transition-colors duration-150 group"
                              >
                                <Heart className="w-5 h-5 text-gray-400 group-hover:text-plum transition-colors" />
                                <span className="font-medium">Favourites</span>
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
