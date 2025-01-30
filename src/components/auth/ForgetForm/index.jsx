

import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ForgetSchema } from "@/lib/utils";
import { Mail, Lock, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PiEyeLight, PiEyeSlash } from "react-icons/pi";

const ForgetForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ForgetSchema),
  });

  const onSubmit = async (data) => {
    try {
      const currentDate = new Date();
      const date = currentDate.toString();
      const response = await axios.post(
        "https://have-a-seatonline.com/api/v1/auth/forgot-password",
        {
          email: data.email,
          password: data.password,
        }
      );

      if (response.status === 202) {
        // console.log(response);
        toast({
          title: "Check Your Email to Reset your Password",
          description: date,
        });
        setEmail("");
        setPassword("")
      } else {
        // console.log('reset failed');
        toast({
          title: "Error occurred while resetting password",
          description: "Please try Again later",
        });
      }
    } catch (error) {
      console.error("Error occurred while resetting password:", error);
      toast({
        title: "Error occurred while resetting password",
        description: "Please try Again later",
      });
    }
  };

  const [showpassword ,SetShowPasword]=useState(false);
  const handleShowPassword =() =>{
    if (showpassword===true)
    {
      SetShowPasword(false);
    }
    else{
      SetShowPasword(true);
    }
    
  }

  return (
    <div className="w-full md:w-11/12 lg:w-full xl:w-11/12 mx-auto lg:p-40">
      <div className="md:w-5/6 lg:w-11/12 xl:w-5/6 order-2 md:order-1 mx-auto flex flex-col gap-3">
      <img src="/assets/has_logo.png" alt="" className="h-40 w-50 mx-auto" />
        <div className="flex flex-col gap-4 text-center">
          <p className="text-4xl font-agrandir md:text-5xl font-bold text-txtcolor"> Forgot Password</p>
          <p className="text-base font-roboto font-normal text-txtcolor">Don’t worry, we can restore it for you</p>
        </div>
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4 mx-auto">
            <div className="flex-grow relative flex flex-col gap-2">
            <p className="text-txtcolor text-sm font-medium font-roboto">Email Address</p>
                <Mail size={22} className="absolute top-9 left-3 " />

              <input
                type="email"
                id="email"
                className={`border border-gray-300 rounded-full w-full py-2 pl-12 px-3 ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder=""
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex-grow flex relative flex-col gap-2">
            <p className="text-txtcolor text-sm font-medium font-roboto">Password</p>
            <Lock size={22} className="absolute top-9 left-3 " />
              {showpassword===true ? (
                  <PiEyeLight size={22} className="text-plum absolute top-9 cursor-pointer right-6" onClick={handleShowPassword}/>
                ) : 
                (
                  <PiEyeSlash size={22} className="text-plum absolute top-9 cursor-pointer right-6" onClick={handleShowPassword}/>
                )

                }

              <input
                type={showpassword ? "text" : "password"} 
                id="password"
                className={`border border-gray-300 rounded-full w-full py-2 px-3 pl-12${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder=""
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="mt-4 text-white bg-plum hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 
              font-medium rounded-full w-full text-xl px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Reset Password
            </button>
          </div>

          
           
          
        </form>

        <div className="text-center my-4 flex items-center justify-center  text-plum">
     <p className="flex items-center gap-2"> 
      <span className="mt-1">
      <ChevronLeft />
        </span>
        <Link to="/login" className="text-center font-agrandir font-bold text-sm text-plum">
       
        Back to login screen
        </Link></p>
      </div>
      </div>
      
    </div>
  );
};

export default ForgetForm;
