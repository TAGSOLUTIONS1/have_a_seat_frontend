import { useState } from "react";

import { useAuth } from "@/contexts/authContext/AuthProvider";
import { LoginSchema, cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { LucideLoader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
    <div className="w-full md:w-11/12 lg:w-full xl:w-11/12">
      <div className="md:w-5/6 lg:w-11/12 xl:w-5/6 order-2 md:order-1">
        <h1 className="text-center text-4xl md:text-5xl font-bold mb-8 md:mb-10">
          Login
        </h1>
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
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
