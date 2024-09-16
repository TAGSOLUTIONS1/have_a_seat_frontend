import { useState } from "react";
import { useForm } from "react-hook-form";

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
    // console.log(data)
    try {
      setLoading(true);
       await register(data);
      setLoading(false);
      navigate("/")
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
      console.error(err , "ERROR ON THE RESPONSE OF SIGNUP API");
      setLoading(false);
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
    <div className="w-full md:w-11/12 lg:w-full xl:w-11/12">
      <div className="md:w-5/6 lg:w-11/12 xl:w-5/6 order-2 md:order-1">
        <h1 className="text-center text-4xl md:text-5xl font-bold mb-8 md:mb-10">
          Sign up
        </h1>
        <Form {...form}>
          <form
            className="flex flex-col space-y-4 md:space-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="First name"
                      className={cn("py-6 px-4 text-lg")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue=""
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Last name"
                      className={cn("py-6 px-4 text-lg")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue=""
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter email"
                      className={cn("py-6 px-4 text-lg")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue=""
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter password"
                      type="password"
                      className={cn("py-6 px-4 text-lg")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue=""
            />
            <Button
              type="submit"
              variant="default"
              className={cn("rounded-md w-full mt-8 text-xl")}
            >
              {loading ? (
                <LucideLoader className="w-6 h-6 mr-2 animate-spin" />
              ) : (
                "Create an account"
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
