import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Edit, Save, HistoryIcon } from "lucide-react";
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

  const storageToken = localStorage.getItem("accessToken");

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
        "https://have-a-seatonline.com/api/v1/users/me",
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
  };

  const handleSaveClick = async () => {
    try {
      const localToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${localToken}`,
        },
      };

      const response = await axios.patch(
        "https://have-a-seatonline.com/api/v1/users/me",
        editedData,
        config
      );

      if (response.status === 200) {
        // console.log("User data updated successfully");
        toast({
          title: "Data Updated Successfuly",
          // description: "Please try again.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        fetchUserInfo(localToken);
        setIsEditMode(false);
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
                <img
                  src="https://bootdey.com/img/Content/avatar/avatar7.png"
                  alt="Admin"
                  className="rounded-full mt-4"
                  width="150"
                />
                <h4 className="text-lg font-semibold mt-4">
                  {user?.first_name || "N/A"} {user?.last_name || "N/A"}
                </h4>
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
