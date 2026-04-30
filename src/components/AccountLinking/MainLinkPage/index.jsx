import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Edit, Save, HistoryIcon, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";
import LinkPageDialogue from "../linkPageDialogue";

const MainLinkingPage = () => {
  const [user, setUser] = useState();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const storageToken = localStorage.getItem("accessToken");

  // Handle avatar URL from backend - construct full URL if needed
  const getAvatarUrl = () => {
    if (avatarPreview) {
      return avatarPreview;
    }
    if (!user?.avatar_url) {
      return "https://t3.ftcdn.net/jpg/04/17/45/28/360_F_417452853_zX2uSxhLns2Ei2nRmXjnpjPw5Ox5V7EK.jpg";
    }
    
    // If avatar_url is already a full URL, use it
    if (user.avatar_url.startsWith('http')) {
      return user.avatar_url;
    }
    
    // If it's a relative path, construct full URL
    return `http://127.0.0.1:8000/${user.avatar_url}`;
  };

  useEffect(() => {
    const localToken = localStorage.getItem("accessToken");
    if (localToken) {
      fetchUserInfo(localToken);
    }
  }, [storageToken]);

  const fetchUserInfo = async (localToken) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localToken}`,
        },
      };
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/users/me",
        config
      );
      if (response.status === 200) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setLoading(false);
      } else {
        console.error(
          "Error fetching user data. Non-200 status code:",
          response.status
        );
        setLoading(false);
        console.error(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error occurred while fetching:", error);
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setEditedData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
    });
    // Reset avatar preview when entering edit mode
    setAvatarPreview(null);
    setSelectedAvatarFile(null);
  };

  const validateImageFile = (file) => {
    // Check file type
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
    
    // Check file size (limit to 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB. The current image is too large to upload.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    
    return true;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateImageFile(file)) {
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      // Check image dimensions
      const img = new Image();
      img.onload = () => {
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
        setAvatarPreview(reader.result);
        setSelectedAvatarFile(file);
        // Automatically enter edit mode when an image is selected
        if (!isEditMode) {
          setIsEditMode(true);
          setEditedData({
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            email: user?.email || "",
          });
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    // Use setTimeout to ensure the file input click happens after event propagation stops
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, 0);
  };

  const uploadAvatar = async (file, token) => {
    try {
      // Get user ID first
      const userResponse = await axios.get(
        "http://127.0.0.1:8000/api/v1/users/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

      // Upload avatar using the backend API
      const avatarResponse = await axios.post(
        `http://127.0.0.1:8000/api/v1/users/${userId}/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (avatarResponse.status === 200) {
        console.log("Avatar uploaded successfully:", avatarResponse.data);
        return avatarResponse.data;
      } else {
        throw new Error("Failed to upload avatar");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      
      // Handle specific error cases
      if (error.response?.status === 413) {
        toast({
          title: "File Too Large",
          description: "The image file is too large to upload. Please select a smaller image.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 400) {
        toast({
          title: "Invalid File",
          description: "The selected file is not a valid image. Please try selecting a different image.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Upload Failed",
          description: "Failed to upload avatar. Please check your internet connection and try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      
      throw error;
    }
  };

  const handleSaveClick = async () => {
    try {
      const localToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${localToken}`,
        },
      };

      // Update profile data (excluding avatar)
      const profileData = {
        first_name: editedData.first_name,
        last_name: editedData.last_name,
        email: editedData.email,
      };

      const response = await axios.patch(
        "http://127.0.0.1:8000/api/v1/users/me",
        profileData,
        config
      );

      // If avatar was changed, upload it separately
      if (selectedAvatarFile) {
        try {
          await uploadAvatar(selectedAvatarFile, localToken);
          toast({
            title: "Profile Updated Successfully",
            description: "Your profile and avatar have been updated.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } catch (avatarError) {
          console.error("Avatar upload failed:", avatarError);
          toast({
            title: "Profile Updated, Avatar Failed",
            description: "Your profile was updated but avatar upload failed. You can try uploading the avatar again.",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        }
      }

      if (response.status === 200) {
        if (!selectedAvatarFile) {
          toast({
            title: "Data Updated Successfuly",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        }
        fetchUserInfo(localToken);
        setIsEditMode(false);
        setAvatarPreview(null);
        setSelectedAvatarFile(null);
      } else {
        console.error(
          "Error updating user data. Non-200 status code:",
          response.status
        );
        toast({
          title: "Failed to update data",
          description: "Please try again later.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        console.error(response.data);
      }
    } catch (error) {
      toast({
        title: "Failed to update data",
        description: "Please try again later.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.error("Error occurred while updating user data:", error);
    }
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setAvatarPreview(null);
    setSelectedAvatarFile(null);
  };

  const handleInputChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
          {/* Left Card (Profile) */}
          <div className="md:col-span-2 flex justify-center">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-sm">
              <div className="card-body p-6 flex flex-col items-center text-center">
                <div className="relative mt-4 inline-block group">
                  <img
                    src={getAvatarUrl()}
                    alt="Profile"
                    className="rounded-full w-[150px] h-[150px] object-cover border-4 border-gray-200 transition-opacity group-hover:opacity-80"
                  />
                  <button
                    onClick={handleAvatarClick}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onMouseUp={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-full shadow-2xl transition-all z-30 border-2 border-white hover:scale-110 cursor-pointer flex items-center justify-center w-11 h-11"
                    type="button"
                    aria-label="Change profile photo"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <h4 className="text-lg font-semibold mt-4">
                  {user?.first_name || "N/A"} {user?.last_name || "N/A"}
                </h4>
                {selectedAvatarFile && (
                  <p className="text-sm text-purple-600 mt-2 font-medium">
                    New photo selected - Click Save to update
                  </p>
                )}
                <div className="mt-4 w-full">
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <LinkPageDialogue />
                    {/* <a href="/user-history">
                      <Button className="bg-purple-600 mt-2 sm:mt-0">
                        <HistoryIcon className="mr-2 h-4 w-4" />
                        History
                      </Button>
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card (Form) */}
        {/* Right Card (Form) */}
          <div className="md:col-span-5 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-left">Profile Information</h2>

            {/* First Name */}
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-1/3 font-medium text-left">First Name</label>
              <div className="sm:w-2/3 w-full">
                {isEditMode ? (
                  <input
                    type="text"
                    value={editedData?.first_name}
                    className="border border-gray-300 p-2 rounded-lg w-full mt-2 sm:mt-0"
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                  />
                ) : (
                  <p className="mt-2 sm:mt-0 text-left">{user?.first_name || "N/A"}</p>
                )}
              </div>
            </div>

            {/* Last Name */}
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-1/3 font-medium text-left">Last Name</label>
              <div className="sm:w-2/3 w-full">
                {isEditMode ? (
                  <input
                    type="text"
                    value={editedData?.last_name}
                    className="border border-gray-300 p-2 rounded-lg w-full mt-2 sm:mt-0"
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                  />
                ) : (
                  <p className="mt-2 sm:mt-0 text-left">{user?.last_name || "N/A"}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-1/3 font-medium text-left">Email</label>
              <div className="sm:w-2/3 w-full">
                {isEditMode ? (
                  <input
                    type="email"
                    value={editedData?.email}
                    className="border border-gray-300 p-2 rounded-lg w-full mt-2 sm:mt-0"
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                  />
                ) : (
                  <p className="mt-2 sm:mt-0 text-left">{user?.email || "N/A"}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center md:justify-end mt-6 gap-4">
              {isEditMode ? (
                <>
                  <Button className="bg-purple-600" onClick={handleSaveClick}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button className="bg-red-500" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button className="bg-purple-600" onClick={handleEditClick}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>

        </div>
      </div>
      )}
    </>
  );
};

export default MainLinkingPage;
