import React, { useState } from "react";

import { useAuth } from "@/contexts/authContext/AuthProvider";
import { LoginSchema , cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { LucideLoader } from "lucide-react";



const LoginForm = () => {
  const { login } = useAuth();
  const [loading , setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  // const [email, setEmail] = React.useState("");
  // const [password, setPassword] = React.useState("");
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    grant_type: "",
    client_id: "",
    client_secret: "",
  });


  const onSubmit = async (form) => {
    setLoading(true);
    console.log(form)
    const { username, password, grant_type, client_id, client_secret } =
      formData;
    let formdata = new FormData();
    formdata.append("username", form.username);
    formdata.append("password", form.password);
    formdata.append("grant_type", grant_type);
    formdata.append("client_id", client_id);
    formdata.append("client_secret", client_secret);
    login(formdata);
    setLoading(false);
  };
  

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData((prev) => {
  //     return {
  //       ...prev,
  //       [name]: value,
  //     };
  //   });
  // };

  return (
     <div className="w-full md:w-11/12 lg:w-full xl:w-11/12">
      <div className="md:w-5/6 lg:w-11/12 xl:w-5/6 order-2 md:order-1">
        <h1 className="text-center text-4xl md:text-5xl font-bold mb-8 md:mb-10">
          Login
        </h1>
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center mb-4">
            <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
            <div className="flex-grow">
              <input
                type="email"
                id="username"
                className={`border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } rounded w-full py-2 px-3`}
                placeholder="Your Email"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center mb-4">
            <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
            <div className="flex-grow">
              <input
                type="password"
                id="password"
                className={`border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded w-full py-2 px-3`}
                placeholder="Password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              variant="default"
              className={cn("rounded-md w-1/2 text-xl")}
            >
              {loading ? (
                <LucideLoader className="w-6 h-6 mr-2 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </div>

          <p className="text-center">
            <a href="/forget" className="underline">
              Forgot password
            </a>
          </p>
          <p className="text-center">
            New to Reatraunt?{" "}
            <a href="/register" className="underline">
              Click to Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
