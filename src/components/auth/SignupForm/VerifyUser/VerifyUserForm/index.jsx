import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import axios from "axios";

import { useToast } from "@/components/ui/use-toast";

const VerifyUserForm = () => {
  const { toast } = useToast();

  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if ((id && id !== null) || undefined) {
      setToken(id);
      handleVerifyToken();
    } else {
      return;
    }
  }, [token]);

  const handleVerifyToken = async (e) => {
    try {
      const currentDate = new Date();
      const date = currentDate.toString();

      const response = await axios.post(
        "https://tagsolutionsltd.com/api/v1/auth/verify",
        {
          token: token,
        }
      );

      if (response.status === 200) {
        setVerified(true);
        toast({
          title: "Verified succesfully",
          description: date,
        });
      } else {
        console.error("Failed to Verify");
      }
    } catch (error) {
      console.error("Error occurred while verifying:", error);
      const currentDate = new Date();
      const date = currentDate.toString();
      toast({
        title: "Error Occurred while verifying:",
        description: date,
      });
    }
  };

  return (
    <div className="w-full md:w-11/12 lg:w-full xl:w-11/12">
      <div className="md:w-5/6 lg:w-11/12 xl:w-5/6 order-2 md:order-1">
        {verified && verified === true ? (
          <h1 className="text-center text-4xl md:text-5xl font-bold mb-8 md:mb-10">
            Verified Successfully 
          </h1>
        ) : (
          <h1 className="text-center text-4xl md:text-5xl font-bold mb-8 md:mb-10">
            Verification Failed
          </h1>
        )}
        {verified && verified === true ? (
          <p className="text-center m-8 text-green-700">You have been successfully verified, and we are pleased to welcome you to our website. You now have the privilege to fully enjoy our platform and make reservations at any of the restaurants available to you.</p>
        ) : (
          <p className="text-center m-8 text-red-600">Your verification has been Failed. You now have the privilege to partially enjoy our platform because you cannot make reservations at any of the restaurants available to you.</p>
        )}
        <form className="space-y-4 md:space-y-6">
          <Link to="/">
          <div className="flex justify-center">
            <button
              type="submit"
              className="md:w-2/3 lg:w-1/2 sm:w-1 text-white bg-purple-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              continue to the website
            </button>
          </div>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default VerifyUserForm;
