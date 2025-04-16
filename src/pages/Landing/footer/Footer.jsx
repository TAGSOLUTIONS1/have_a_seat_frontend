import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/assets/has_logo.png";
import {
  FooterLinks,
  initialBookingState,
  socialMediaLinks,
} from "@/components/constants/constants";
import { Link as ScrollLink } from "react-scroll";
import { Mail, Phone } from "lucide-react";

function Footer() {
  const [formData, setFormData] = useState(initialBookingState);
  const navigate = useNavigate();

  const handleSearch = () => {
    localStorage.setItem("searchFormData", JSON.stringify(formData)); // Store form data before navigating
    const route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;

    navigate(route);
  };
  return (
    <div id="contact" className="bg-[#F5EDFC] py-5 md:py-0 px-5 md:px-[75px]">
      {/* web*/}
      <div className=" hidden md:flex  py-24  flex-col md:flex-row justify-between">
        <img
          src={logo}
          alt="have a seat logo"
          className="h-[12rem] w-[20rem]"
        />
        <div></div>
        <div>
          <h1 className="text-plum text-2xl font-poppins font-bold mb-2">Home</h1>
          <ul className="flex flex-col gap-2">
            {FooterLinks.map((link) => (
              <li key={link} className="cursor-pointer text-ftext text-base font-normal font-roboto">
                <ScrollLink
                  to={link.to} // Matches the `id` of the target section
                  spy={true}
                  smooth={true}
                  duration={1500}
                 
                >
                  {link.label} {/* Display the label */}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </div>

        {/* social media web*/}
        <ul className=" text-plum text-lg flex flex-col gap-[1.25rem]">
          <li className="text-plum text-2xl font-poppins font-bold mb-2">Social media</li>

          <ul className="flex flex-col gap-5">
            <li className="flex items-center gap-3 text-sm">
              <img src="/assets/phone.png" />{" "}
              <span className="text-ftext text-base font-normal font-roboto">+1 (860) 960-0316</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <img src="/assets/mail.png" />
              <a href="mailto:contact@haveaseaton.com" className="text-ftext text-base font-normal font-roboto">
                contact@haveaseaton.com
              </a>
            </li>
          </ul>
        </ul>
      </div>

      {/* newsletter */}

      <div className="flex flex-col w-full gap-6 md:gap-0 md:flex-row justify-between items-center">
        <div className="w-[90%] text-center sm:text-left sm:w-1/2">
          <h2 className="text-3xl font-agrandir text-ftext font-bold text-center md:text-left ">Join Our Newsletter</h2>
          <p className="text-xl text-grayblu font-roboto">
            Only updates and special offers. No spams.
          </p>
        </div>

        <form className=" flex flex-col md:w-1/2 gap-6 md:gap-0 md:flex-row justify-end items-center text-end">
          <div className="relative w-full md:w-3/5">
            <Mail size={20} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-grayblu" />
            <input
              type="email"
              placeholder="Enter your email address..."
              className="w-full text-grayblu pl-10 pr-4 py-2 rounded-full 
              border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="ml-4 px-6 md:px-2 lg:px-6 py-2 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            Subscribe →
          </button>
        </form>
      </div>

      {/* copyrigths */}
      <div className=" py-4">
        <div className=" border-t-2 border-black m-auto md:w-full">
          <div className="text-center md:text-left flex flex-col gap-4 md:gap-0 md:flex-row text-base justify-between items-center py-5">
            <div>
              <p className=" ">Copyright © HaveaSeat. All rights reserved. </p>
            </div>
            <ul>
              <li className="flex gap-[22px] ">
                {socialMediaLinks.map((item, index) => (
                  <a
                    key={item}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <img src={item.icon} alt="" />
                  </a>
                ))}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
