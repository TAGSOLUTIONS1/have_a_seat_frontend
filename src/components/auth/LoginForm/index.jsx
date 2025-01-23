import { useState } from "react";

import { useAuth } from "@/contexts/authContext/AuthProvider";
import { LoginSchema, cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { LucideLoader } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

const LoginForm = () => {
  const { login, handleError } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const onSubmit = async (form) => {
    try {
      setLoading(true);
      const formdata = new FormData();
      const formDataEntries = {
        username: form.username,
        password: form.password,
        grant_type: "",
        client_id: "",
        client_secret: "",
      };
      for (const [key, value] of Object.entries(formDataEntries)) {
        formdata.append(key, value);
      }
      await login(formdata);
      navigate("/");
    } catch (err) {
      handleError(err.response.status, toast);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full md:w-11/12 lg:w-full xl:w-11/12 mx-auto ">
      <div className="md:w-5/6 lg:w-11/12 xl:w-5/6 order-2 md:order-1 mx-auto flex flex-col gap-3">
      <img src="/assets/has_logo.png" alt="" className="h-40 w-50 mx-auto" />

       <div className="flex flex-col gap-4 text-center">
        <p className="text-4xl font-agrandir md:text-5xl font-bold text-txtcolor">Welcome Back</p>
        <p className="text-base font-roboto font-normal text-txtcolor">Let’s sign in to your account and get started</p>
       </div>
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex items-center mb-4">
            <div className="flex-grow relative flex flex-col gap-3">
              <p className="text-txtcolor text-sm font-medium font-roboto">Email Address</p>
              <Mail className="absolute top-14 left-[1.1rem] transform -translate-y-1/2 " />
              <input
                type="email"
                id="username"
                className={`border ${
                  errors.username ? "border-red-500" : "border-gray-300 rounded-full"
                } rounded w-full py-2 px-3 pl-12`}
             
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>
    
            <div className="flex-grow flex relative flex-col gap-2">
            <p className="text-txtcolor text-sm font-medium font-roboto">Password</p>
              <Lock className="absolute top-14 left-[1.1rem] transform -translate-y-1/2 " />

              <input
                type="password"
                id="password"
                className={`border ${
                  errors.password ? "border-red-500" : "border-gray-300 rounded-full"
                } rounded w-full py-2 pr-4 pl-12`}
               
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          <div className="flex-grow">
           <Button
              type="submit"
              variant="default"
              className={cn("rounded-full w-full text-xl mt-2") }
            >
              {loading ? (
                <LucideLoader className="w-6 h-6 mr-2 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
  </div>
      

         
        </form>
    
<div  className="my-4">
  
<p className="text-center">
            <a href="/forget" className="underline text-purple-600">
              Forgot password
            </a>
          </p>
          <p className="text-center">
            Don't have an account?{" "}
            <Link to="/register" className="underline  text-purple-600">
              Sign Up
            </Link>
          </p>
</div>
      </div>
    </div>
  );
};

export default LoginForm;
