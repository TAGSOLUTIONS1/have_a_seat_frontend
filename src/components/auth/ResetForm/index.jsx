import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useToast } from "@/components/ui/use-toast";

import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResetSchema } from "@/lib/utils";

const ResetForm = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate()
  const [paramsToken, setParamsToken] = useState();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(ResetSchema),
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if ((token && token !== null) || undefined) {
      setParamsToken(token);
    } else {
      return;
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const currentDate = new Date();
      const date = currentDate.toString();
      const response = await axios.post(
        "https://tagsolutionsltd.com/api/v1/auth/reset-password",
        {
          token: paramsToken,
          password: data.newPassword,
        }
      );
      if (response.status === 200) {
        toast({
          title: "The password has been successfully reset.",
          description: date,
        });
        navigate("/")
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

        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center mb-4">
            <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
            <div className="flex-grow">
              <input
                type="password"
                id="new_password"
                className={`border border-gray-300 rounded w-full py-2 px-3 ${errors.newPassword ? 'border-red-500' : ''}`}
                placeholder="Enter New Password"
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-[97%] ml-[3%] text-white bg-purple-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
