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
        "https://3.101.103.14/api/v1/users/me",
        config
      );
      if (response.status === 200) {
        setUser(response.data);
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
        "https://3.101.103.14/api/v1/users/me",
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
        <div className="md:ml-36 lg:ml-36">
          <div className="grid grid-cols-7 md:gap-7   lg:gap-7">
            <div className=" md:col-span-2 ml-4 -mr-8 md:-ml-20  mt-32  sm:ml-28 -sm:mr-24 lg:col-span-2 sm:col-span-5 col-span-6">
              <div className=" bg-white shadow-lg rounded-lg card">
                <div className="card-body">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar7.png"
                      alt="Admin"
                      className="rounded-circle mt-8"
                      width="150"
                    />
                    <div className="mt-3 mb-4">
                      <h4 className="text-lg">
                        {user?.first_name || "N/A"} {user?.last_name || "N/A"}
                      </h4>
                      <div>
                        <div className="flex items-center space-x-4">
                          <div className="w-full text-center">
                            <LinkPageDialogue />
                          </div>
                          {/* <div className="w-full text-center ">
                            <a href="/user-history">
                            <Button className="bg-purple-600 mt-4 mx-auto" >
                              <HistoryIcon className="mr-2 h-4 w-4" />
                              History
                            </Button>
                            </a>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-4 lg:col-span-4 mx-2 sm:ml-24 sm:-mr-24 mb-52 sm:col-span-5 col-span-7 mt-32">
              <div
                className={`bg-white shadow-lg rounded-lg px-6 pt-12 pb-8 ${
                  isEditMode ? "h-[295px] pt-4 overflow-hidden" : ""
                }`}
              >
                <div className="mb-8">
                  <div className="flex items-center">
                    <div className="w-1/3">
                      <h6 className="mb-0">First Name</h6>
                    </div>
                    <div className="w-2/3">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editedData?.first_name}
                          className="border-2 p-2 -mb-4 rounded-lg"
                          onChange={(e) =>
                            handleInputChange("first_name", e.target.value)
                          }
                        />
                      ) : (
                        user?.first_name || "N/A"
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="flex items-center">
                    <div className="w-1/3">
                      <h6 className="mb-0">Last Name</h6>
                    </div>
                    <div className="w-2/3">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editedData?.last_name}
                          className="border-2 p-2 -mb-4 rounded-lg"
                          onChange={(e) =>
                            handleInputChange("last_name", e.target.value)
                          }
                        />
                      ) : (
                        user?.last_name || "N/A"
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="flex items-center">
                    <div className="w-1/3">
                      <h6 className="mb-0">Email</h6>
                    </div>
                    <div className="w-2/3">
                      {isEditMode ? (
                        <input
                          type="email"
                          value={editedData?.email}
                          className="border-2 p-2 rounded-lg w-2/3"
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                        />
                      ) : (
                        user?.email || "N/A"
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center items-center mx-auto mt-9">
                  {isEditMode ? (
                    <>
                      <Button
                        className="bg-purple-600 mr-2"
                        onClick={handleSaveClick}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        className="bg-red-500"
                        onClick={handleCancelClick}
                      >
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
        </div>
      )}
    </>
  );
};

export default MainLinkingPage;
