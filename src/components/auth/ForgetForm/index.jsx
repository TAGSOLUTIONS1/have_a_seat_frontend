// import React , {useState} from 'react'

// import axios from "axios";

// import { useToast } from "@/components/ui/use-toast";


// const ForgetForm = () => {
  
//   const { toast } = useToast();
//     const [email , setEmail] = useState("")

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//           const currentDate = new Date();
//           const date = currentDate.toString();
//           const response = await axios.post(
//             "https://tagsolutionsltd.com/api/v1/auth/forgot-password",
//             {
//               email,
//             }
//           );
//           if (response.status === 202) {
//             console.log(response)
//             toast({
//               title: "Check Your Email to Reset your Password",
//               description: date,
//             });
//             setEmail("")
//           } else {
//             console.log("reset failed");
//             toast({
//               title: "Error occurred while resetting password",
//               description: "Please try Again later",
//             });
//           }
//         } catch (error) {
//           console.error("Error occurred while resetting password:", error);
//           toast({
//             title: "Error occurred while resetting password",
//             description: "Please try Again later",
//           });
//         }
//       };

      
//   return (
//     <div className="w-full md:w-11/12 lg:w-full xl:w-11/12 mt-10">
//       <div className="md:w-5/6 lg:w-11/12 xl:w-5/6 order-2 md:order-1">
//         <h1 className="text-center text-4xl md:text-5xl font-bold mb-8 md:mb-10">
//           Forgot Password
//         </h1>

//         <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
//           <div className="flex items-center mb-4">
//             <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
//             <div className="flex-grow">
//               <input
//                 type="email"
//                 id="email"
//                 className="border border-gray-300 rounded w-full py-2 px-3"
//                 placeholder="Existing Email"
//                 value={email}
//                 onChange={(e) =>setEmail(e.target.value )}
//               />
//             </div>
//           </div>

//           <div className="flex justify-center">
//             <button
//               type="submit"
//               className="md:w-2/3 lg:w-1/2 sm:w-1 text-white bg-purple-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
//             >
//               Reset PASSWORD
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default ForgetForm

import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ForgetSchema } from '@/lib/utils';

const ForgetForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ForgetSchema),
  });

  const onSubmit = async (data) => {
    try {
      const currentDate = new Date();
      const date = currentDate.toString();
      const response = await axios.post(
        'https://tagsolutionsltd.com/api/v1/auth/forgot-password',
        {
          email: data.email,
        }
      );

      if (response.status === 202) {
        // console.log(response);
        toast({
          title: 'Check Your Email to Reset your Password',
          description: date,
        });
        setEmail('');
      } else {
        // console.log('reset failed');
        toast({
          title: 'Error occurred while resetting password',
          description: 'Please try Again later',
        });
      }
    } catch (error) {
      console.error('Error occurred while resetting password:', error);
      toast({
        title: 'Error occurred while resetting password',
        description: 'Please try Again later',
      });
    }
  };

  return (
    <div className="w-full md:w-11/12 lg:w-full xl:w-11/12 mt-10">
      <div className="md:w-5/6 lg:w-11/12 xl:w-5/6 order-2 md:order-1">
        <h1 className="text-center text-4xl md:text-5xl font-bold mb-8 md:mb-10">
          Forgot Password
        </h1>

        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center mb-4">
            <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
            <div className="flex-grow">
              <input
                type="email"
                id="email"
                className={`border border-gray-300 rounded w-full py-2 px-3 ${
                  errors.email ? 'border-red-500' : ''
                }`}
                placeholder="Existing Email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-[97%] ml-[3%] text-white bg-purple-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Reset PASSWORD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetForm;
