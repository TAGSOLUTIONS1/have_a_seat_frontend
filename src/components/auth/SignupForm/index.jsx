import { useState } from "react";
import { useForm } from "react-hook-form";
import { User,Lock, Mail } from "lucide-react";

import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { SignupSchema, cn } from "@/lib/utils";
import { register } from "@/services/auth";

import { ToastAction } from "@radix-ui/react-toast";
import { LucideLoader } from "lucide-react";

const SignupForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: yupResolver(SignupSchema),
  });

  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await register(data);
      // Store user data in local storage
      localStorage.setItem('userData', JSON.stringify({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        // You might want to store phone if you collect it in the signup form
      }));
      setLoading(false);
      navigate("/");
      toast({
        title: "Account created.",
        description: "We've created your account.",
        status: "success",
        duration: 10000 * 60,
        isClosable: true,
        action: (
          <ToastAction altText="login">
            <a href="/login">
              <Button className="bg-purple-600">login</Button>
            </a>
          </ToastAction>
        ),
      });
    } catch (err) {
      console.error(err, "ERROR ON THE RESPONSE OF SIGNUP API");
      setLoading(false);
      // Handle error cases
      switch (err?.response?.status) {
        case 400:
          toast({
            title: "Account already exists.",
            description: "Please try again.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          break;
        case 500:
          toast({
            title: "Server error.",
            description: "Please try again.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          break;
      }
    }
  };
  return (
    <div className="w-full md:w-11/12 lg:w-full xl:w-11/12 mx-auto font-raleWay lg:p-40">
      <div className=" mx-auto flex flex-col gap-3">
        <div className="flex flex-col gap-3 ">
          <img src="/assets/has_logo.png" alt="" className="h-40 w-50 mx-auto" />
        <h1 className="text-center text-4xl md:text-5xl font-bold ">
        Let’s Create Your Account.
        </h1>
        <p className="text-center">Sign up for free and get started quickly.</p>
        </div>
        <Form {...form}>
          <form
            className="flex flex-col space-y-4 md:space-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <div className="relative">
                  <FormItem>
                  <span>First Name</span>
                   <User className="absolute top-9 left-3 " />
                  <FormControl>
                    <Input
                      
                      className={cn("py-6 px-4 text-lg rounded-full pl-10")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                </div>
              )}
              defaultValue=""
            />
            <div className="relative">
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <span>Last Name</span>
                  <User className="absolute top-9 left-3 " />
                  <FormControl>
                    <Input
                     
                      className={cn("py-6 px-4 text-lg rounded-full pl-10")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue=""
            />
            </div>
          <div className="relative">
          <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <span>Email</span>
                  <Mail className="absolute top-9 left-3 " />

                  <FormControl>
                    <Input
                   
                      className={cn("py-6 px-4 text-lg rounded-full pl-10")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue=""
            />
          </div>
        <div className="relative">
        <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <span>password</span>
                  <Lock className="absolute top-9 left-3 " />

                  <FormControl>
                    <Input
                     
                      type="password"
                      className={cn("py-6 px-4 text-lg rounded-full pl-10")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue=""
            />
        </div>
            <Button
              type="submit"
              variant="default"
              className={cn(" w-full mt-8 text-xl rounded-full")}
            >
              {loading ? (
                <LucideLoader className="w-6 h-6 mr-2 animate-spin" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="underline text-primary text-lg">
              Click to login
            </a>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default SignupForm;
