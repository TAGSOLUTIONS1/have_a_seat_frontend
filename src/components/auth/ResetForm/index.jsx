import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useToast } from "@/components/ui/use-toast";

import axios from "axios";

const ResetForm = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [paramsToken, setParamsToken] = useState();
  const [newPassword, setnewPassword] = useState();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if ((token && token !== null) || undefined) {
      setParamsToken(token);
    } else {
      return;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date();
      const date = currentDate.toString();
      const response = await axios.post(
        "https://tagsolutionsltd.com/api/v1/auth/reset-password",
        {
          token: paramsToken,
          password: newPassword,
        }
      );
      if (response.status === 200) {
        toast({
          title: "Check Your Email to Reset your Password",
          description: date,
        });
        console.log(response);
        
      } else {
        console.log("reset failed");
      }
    } catch (error) {
      console.error("Error occurred while resetting password:", error);
    }
  };

  return (
    <div className="w-full md:w-11/12 lg:w-full xl:w-11/12 mt-10">
      <div className="md:w-5/6 lg:w-11/12 xl:w-5/6 order-2 md:order-1">
        <h1 className="text-center text-4xl md:text-5xl font-bold mb-8 md:mb-10">
          Reset Password
        </h1>

        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center mb-4">
            <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
            <div className="flex-grow">
              <input
                type="password"
                id="new_password"
                className="border border-gray-300 rounded w-full py-2 px-3"
                placeholder="Enter New Password"
                onChange={(e) => setnewPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="md:w-2/3 lg:w-1/2 sm:w-1 text-white bg-purple-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              RESET PASSWORD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetForm;
