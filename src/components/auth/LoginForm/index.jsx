import { useState, useEffect } from "react";

import { useAuth } from "@/contexts/authContext/AuthProvider";
import { LoginSchema, cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { LucideLoader } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Clock } from "lucide-react";
import { PiEyeLight, PiEyeSlash } from "react-icons/pi";
import { PiSignIn } from "react-icons/pi";

const LoginForm = () => {
  const { login, handleError } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hasPendingReservation, setHasPendingReservation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  // Check for pending reservations on component mount
  useEffect(() => {
    const pendingReservation = localStorage.getItem('pendingReservation');
    if (pendingReservation) {
      console.log("pendingReservation local", pendingReservation);
      setHasPendingReservation(true);
    }
  }, []);

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
      
      // Check if there's a pending reservation
      const pendingReservationStr = localStorage.getItem('pendingReservation');
      if (pendingReservationStr) {
        try {
          const pendingReservation = JSON.parse(pendingReservationStr);
          console.log("pendingReservation parsed", pendingReservation);
          const reservationType = pendingReservation.reservationData.restaurant_type;
          const timeSlotData = pendingReservation.selectedTimeSlot; // Fixed: was timeSlotData
          const formData = pendingReservation.formData;
          const reservationCard = pendingReservation.reservationData;
          
          if (reservationType === 'yelp') {
            const updatedNextData = [reservationCard, timeSlotData];
            const route = `/reservation?data=${encodeURIComponent(
              JSON.stringify(updatedNextData)
            )}`;
            navigate(route);
          } else if (reservationType === 'open_table') {
            const restaurant_id = reservationCard?.id;
            const restaurantName = reservationCard?.name;
            const restaurantAddress = reservationCard?.address;
            const restaurantCuisines = reservationCard?.cuisines;
            const updatedNextData = [
              formData,
              timeSlotData,
              restaurant_id,
              restaurantName,
              restaurantAddress,
              restaurantCuisines,
            ];
            const route = `/reservation?data=${encodeURIComponent(
              JSON.stringify(updatedNextData)
            )}`;
            navigate(route);
          }
          
          toast({
            title: "Welcome back!",
            description: "Your reservation details have been restored. You can now proceed with your booking.",
            variant: "default",
            duration: 5000,
          });
          
          // Clear pending reservation from localStorage after successful redirect
          localStorage.removeItem('pendingReservation');
        } catch (error) {
          console.error('Error parsing pending reservation:', error);
          localStorage.removeItem('pendingReservation');
          navigate("/");
        }
      } else {
        // No pending reservation, go to home
        navigate("/");
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.status) {
        handleError(err.response.status);
      } else {
        handleError(500); // Default to server error
      }
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }
  return (
    <div className="w-full md:w-11/12 lg:w-full xl:w-11/12 mx-auto lg:p-40">
      <div className="md:w-5/6 lg:w-11/12 xl:w-5/6 order-2 md:order-1 mx-auto flex flex-col gap-3">
      <img src="/assets/has_logo.png" alt="" className="h-40 w-50 mx-auto" />

       <div className="flex flex-col gap-4 text-center">
        <p className="text-4xl font-agrandir md:text-5xl font-bold text-txtcolor">Welcome Back</p>
        <p className="text-base font-roboto font-normal text-txtcolor">Let's sign in to your account and get started</p>
       </div>
       
       {/* Pending reservation indicator */}
       {hasPendingReservation && (
         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
           <div className="flex items-center gap-2 text-blue-800">
             <Clock className="h-5 w-5" />
             <div>
               <p className="font-semibold text-sm">Complete Your Reservation</p>
               <p className="text-xs text-blue-700">
                 After signing in, you'll be redirected back to complete your reservation.
               </p>
             </div>
           </div>
         </div>
       )}
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex items-center mb-4">
            <div className="flex-grow relative flex flex-col gap-3">
              <p className="text-txtcolor text-sm font-medium font-roboto">Email Address</p>
              <Mail size={22} className="absolute top-10 left-3 " />
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
              <Lock size={22} className="absolute top-9 left-3 " />
                {showPassword ? (
                    <PiEyeLight size={22} className="text-plum absolute top-9 cursor-pointer right-6" onClick={handleShowPassword}/>
                  ) : 
                  (
                    <PiEyeSlash size={22} className="text-plum absolute top-9 cursor-pointer right-6" onClick={handleShowPassword}/>
                  )
  
                  }

              <input
                type={showPassword ? "text" : "password"}
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
            <div  className="">
            <p className="text-end">
                <a href="/forget" className="text-plum font-roboto font-medium text-sm">
                  Forgot password
                </a>
              </p>
            </div>

          <div className="flex-grow">
           <Button
              type="submit"
              variant="default"
              className={cn("rounded-full w-full bg-plum text-xl mt-2") }
            >
              {loading ? (
                <LucideLoader className="w-6 h-6 mr-2 animate-spin" />
              ) : (
                "Sign In"
              )}
              <PiSignIn size={20} className="mx-2" />
            </Button>
  </div>
      <div className="my-4">
          <p className="text-center font-agrandir font-bold text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-plum">
                Sign Up
              </Link>
            </p>

      </div>

         
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
