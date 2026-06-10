import React, { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import axios from "axios";
import BookRestaurant from "../BookResturant/BookRestaurant";
import { useToast } from "@/components/ui/use-toast";
import { Base_Url } from "@/baseUrl";

export default function ContactForm() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      const response = await axios.post(`${Base_Url}/api/v1/connect/contact-us`, form);
      console.log("Submitted:", response.data);
      setSuccess(true);
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        message: "",
      });
      toast({
      title: "Your message has been sent successfully!",
      status: "success",
      duration: 8000,
      isClosable: true,
    });
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
   <div className="bg-[#F5EDFC]">
    <BookRestaurant />
     <div className="flex items-center px-20 md:px-40 justify-center  p-6">       
      <div className="py-10 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-agrandir font-bold text-shipGrey mb-4">
            Have <span className="text-plum">Queries</span> or{" "}
            <span className="text-plum">Suggestions?</span>
          </h2>
          <p className="text-graysublabel font-inter leading-relaxed">
            Get in touch — you can reach us anytime.
          </p>
        </div>

        <form className="space-y-2 sm:space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-2 sm:gap-4">
            <input
              name="first_name"
              type="text"
              placeholder="First name"
              value={form.first_name}
              onChange={handleChange}
              className="flex-1 p-2 sm:p-4 px-7 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <input
              name="last_name"
              type="text"
              placeholder="Last name"
              value={form.last_name}
              onChange={handleChange}
              className="flex-1 p-2 sm:p-4 px-7 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div className="relative flex items-center">
              <AiOutlineMail
                size={20}
                color="#9235E2"
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
              />
              <input
                name="email"
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-4 pl-12 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

          <textarea
            name="message"
            placeholder="How can we help?"
            className="w-full p-2 sm:p-4 px-7 rounded-[32px] focus:outline-none focus:ring-2 focus:ring-purple-400"
            rows={4}
            value={form.message}
            onChange={handleChange}
          ></textarea>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-plum text-white py-2 sm:py-3 rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400
            text-lg sm:text-xl font-roboto font-medium"
          >
            {submitting ? "Sending..." : "Submit"}
          </button>
          {success && (
              <p className="text-green-600 text-center pt-2">
                Your message has been sent successfully!
              </p>
            )}
        </form>
      </div>
    </div>
   </div>
  )
}
