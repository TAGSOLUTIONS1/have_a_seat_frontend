import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/authContext/AuthProvider";

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
    email: Yup.string().email("Invalid email address").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",  
    },
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

  return (
    <div className="flex bg-white p-8 rounded shadow-md">
      <div className="w-full md:w-2/3 lg:w-2/3 community-service-hours-form">
        <h2 className="text-3xl font-bold text-center pb-8">Reservation Form</h2>
        <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-2">
          <label htmlFor="first_name" className="text-sm font-medium text-gray-700">
            First Name:
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            required
            className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
            {...formik.getFieldProps("first_name")}
          />
          {formik.touched.first_name && formik.errors.first_name ? (
            <div className="text-red-500">{formik.errors.first_name}</div>
          ) : null}

          <label htmlFor="last_name" className="text-sm font-medium text-gray-700">
            Last Name:
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            required
            className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
            {...formik.getFieldProps("last_name")}
          />
          {formik.touched.last_name && formik.errors.last_name ? (
            <div className="text-red-500">{formik.errors.last_name}</div>
          ) : null}

          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Number:
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            required
            className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
            {...formik.getFieldProps("phone")}
          />
          {formik.touched.phone && formik.errors.phone ? (
            <div className="text-red-500">{formik.errors.phone}</div>
          ) : null}

          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500">{formik.errors.email}</div>
          ) : null}

          <div className="flex flex-col md:flex-row lg:flex-row items-center justify-center md:space-x-4 lg:space-x-4 ">
            <button
              type="submit"
              className="inline-flex justify-center items-center px-4 py-2 text-base font-medium rounded-md text-white w-full md:w-2/3 lg:w-2/3  align-center bg-purple-600 hover:bg-purple-800 mt-4"
              style={{ minWidth: "100px" }}
            >
              Make a Reservation
            </button>
            
            <button
              type="button"
              className="inline-flex justify-center items-center px-4 py-2 text-base font-medium rounded-md text-white w-full md:w-1/3 lg:w-1/3 align-center bg-purple-600 hover:bg-purple-800 mt-4"
              style={{ minWidth: "100px" }}
              onClick={formik.handleReset}
            >
              Cancel Reservation
            </button>
          </div>
        </form>
      </div>
      <div className=" md:w-2/5 lg:w-2/5 hidden md:block lg:block md:px-24 lg:px-24 px-0">
        <img
          src="/assets/bookingImage.svg"
          className="mt-32"
          width={"250px"}
          height={"350px"}
          alt=""
        />
      </div>
    </div>
  );
};

export default ReservationForm;