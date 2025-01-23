import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { User, Phone, Mail } from "lucide-react";

const ReservationForm = ({ formData, bookingInfo }) => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    phone: Yup.string()
      .matches(/^\d+$/, "Phone number must contain only digits")
      .length(10, "Phone number must be 10 digits")
      .required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  // Initialize form values
  const [initialValues, setInitialValues] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    // Retrieve data from local storage
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      const newValues = {
        first_name: parsedData.first_name || "",
        last_name: parsedData.last_name || "",
        phone: "", // Optionally set a default value or leave empty
        email: parsedData.email || "",
      };
      setInitialValues(newValues);
      formik.setValues(newValues); // Update formik values when initial values change
    }
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!authState.user?.id) {
        toast({
          title: "You need to login first",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      const updatedNextData = {
        reservationFormData: values,
        bookingInfo: bookingInfo,
        formData: formData,
      };
      const route = `/reservation-status?data=${encodeURIComponent(
        JSON.stringify(updatedNextData)
      )}`;
      navigate(route);
    },
  });

  // Ensure initial values are set when formik is initialized
  useEffect(() => {
    formik.setValues(initialValues);
  }, [initialValues]);

  return (
    <div className="bg-white rounded-[30px] border-[0.5px] border-[#B9B9B9] shadow-md text-[#39353C] 
    flex items-center justify-center p-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 ">
        <div className="text-center">
          <div className="flex items-center justify-center w-32 p-2 h-32 mx-auto bg-plum rounded-full">
            <img src="/assets/reserve.png" alt="from reseveration photo" />
          </div>
          <h2 className="mt-8 text-shipGrey font-agrandir text-4xl md:text-5xl font-bold ">
            Reservation Form
          </h2>
          <p className="mt-4 text-base md:text-xl font-normal font-agrandir">
            Fill in the information to reserve.
          </p>
        </div>
        <form className="mt-8 space-y-8" onSubmit={formik.handleSubmit}>
          {/* Name Input */}
          <div className="relative">
            <label
              htmlFor="first_name"
              className="block ml-6 font-roboto text-shipGrey font-normal text-base my-2"
            >
              First Name
            </label>
            <User  className="absolute top-[52px] left-[2.25rem] transform -translate-y-1/2 " />
            <input
              type="text"
              placeholder="Required"
              className="w-full pl-10 pr-4 py-2 ml-7 border rounded-full text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              id="first_name"
              {...formik.getFieldProps("first_name")}
            />
            {formik.touched.first_name && formik.errors.first_name ? (
              <div className="mt-1 h-5 ml-10 text-sm text-red-500">
                {formik.errors.first_name}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <label
              htmlFor="last_name"
              className="block ml-6 font-roboto text-shipGrey font-normal text-base my-2"
            >
              Last Name
            </label>
            <User  className="absolute top-[52px] left-[2.25rem] transform -translate-y-1/2 "/>
            <input
              type="text"
              placeholder="Required"
              className="w-full pl-10 pr-4 py-2 ml-7 border rounded-full text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              id="last_name"
              {...formik.getFieldProps("last_name")}
            />
            {formik.touched.last_name && formik.errors.last_name ? (
              <div className=" mt-1 h-5 ml-10 text-sm text-red-500">
                {formik.errors.last_name}
              </div>
            ) : null}
          </div>

          {/* Contact Number Input */}
          <div className="relative">
            <label
              htmlFor="phone"
              className="block ml-6 font-roboto text-shipGrey font-normal text-base my-2"
            >
              Contact Number
            </label>
            <Phone  className="absolute top-[54px] left-[2.25rem] transform -translate-y-1/2 " />
            <input
              type="text"
              placeholder="Required"
              className="w-full pl-10 pr-4 py-2 ml-7 px-2 border rounded-full text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
              id="phone"
              {...formik.getFieldProps("phone")}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="mt-1 h-5 ml-10 text-sm text-red-500">
                {formik.errors.phone}
              </p>
            )}
          </div>

          {/* Email Address Input */}
          <div className="relative">
            <label
              htmlFor="email"
              className="block ml-6 font-roboto text-shipGrey font-normal text-base my-2"
            >
              Email Address
            </label>
            <Mail className="absolute top-[54px] left-[2.25rem] transform -translate-y-1/2 " />
            <input
              type="email"
              placeholder="Required"
              className="w-full pl-10 pr-4 py-2 px-2 ml-7 border rounded-full text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
              id="email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 h-5 ml-10 text-sm text-red-500">
                {formik.errors.email}
              </p>
            )}
          </div>

          <p className="text-sm text-graysublabel font-normal font-roboto">
            After completion of the form you will receive a confirmation of your
            reservation by <span className="font-bold">e-mail</span> or{" "}
            <span className="font-bold">text message.</span>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-full bg-plum text-white font-medium hover:bg-purple-700 transition"
          >
            Book a Table →
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
