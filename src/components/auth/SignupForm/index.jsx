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

import { SignupSchema, cn } from "@/lib/utils";
import { register } from "@/services/auth";

const SignupForm = () => {
  const form = useForm({
    resolver: yupResolver(SignupSchema),
  });
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const res = await register(data);
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 10000 * 60,
        isClosable: true,
      });
    } catch (err) {
      switch (err.response.status) {
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
              className={cn("rounded-md w-full text-xl")}
            >
              Create an account
            </Button>
          </form>
          Already have an account?
          <Button variant="link" href="/login" className="underline text-lg">
            Click to login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SignupForm;
