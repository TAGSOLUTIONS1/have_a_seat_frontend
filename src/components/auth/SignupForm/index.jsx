import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { register } from "@/services/auth";

const SignupForm = () => {
  const form = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    const response = await register(data);
    if (response.success) {
      toast({
        variant: "success",
        title: "Success!",
        description: "Your account has been created.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: response.error.detail,
      });
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
