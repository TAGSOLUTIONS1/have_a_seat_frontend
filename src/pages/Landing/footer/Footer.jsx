import {
  footerLinks,
  initialBookingState,
  socialMediaLinks,
} from "@/components/constants/constants";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <div id="contact">
      {/* web*/}
      <div className=" hidden md:flex px-5 md:px-[75px] py-24  flex-col md:flex-row justify-between">
        <div></div>
        <ul className="text-plum text-lg flex flex-col gap-[1.25rem]">
          <li className="font-bold">+1 (860) 960-0316</li>
          <li>
            <a href="mailto:contact@haveaseaton.com">contact@haveaseaton.com</a>
          </li>
          <button
            onClick={handleSearch}
            className="text-white rounded-lg bg-plum py-3 px-10 text-center cursor-pointer"
          >
            Book a Table
          </button>
        </ul>
        <ul className="flex flex-col gap-[1.25rem]">
          {footerLinks.map((link) => (
            <li key={link} className="text-plum text-lg">
              {link}
            </li>
          ))}
        </ul>

        <ul className=" flex flex-col gap-[1.25rem]">
          <li className="text-plum text-lg">License</li>
          <li className="text-plum text-lg">Privacy Policy</li>
        </ul>

        {/* social media web*/}
        <ul className=" text-plum text-lg flex flex-col gap-[1.25rem]">
          <li>Social media</li>

          <div className="flex gap-2">
            {socialMediaLinks.map((link) => (
              <Link key={link} to={link.link} className="text-plum text-lg">
                {link.icon}
              </Link>
            ))}
          </div>
        </ul>
      </div>
      {/* social media mobile */}
      <div className="md:hidden px-5 md:px-[75px] py-24 flex flex-col md:flex-row justify-between">
        <div></div>

        <ul className="flex flex-col gap-[1.25rem]">
          {footerLinks.map((link) => (
            <li key={link} className="text-plum text-lg">
              {link}
            </li>
          ))}
          <li className="text-plum text-lg">License</li>
          <li className="text-plum text-lg">Privacy Policy</li>
        </ul>

        <ul className="text-plum text-lg flex my-5 flex-col gap-[1.25rem]">
          <li className="font-bold">+1 (860) 960-0316</li>
          <li>
            <a href="mailto:contact@haveaseaton.com">contact@haveaseaton.com</a>
          </li>
          <button
            onClick={handleSearch}
            className="text-white rounded-lg w-[65%] bg-plum py-3 px-10 text-center cursor-pointer"
          >
            Book a Table
          </button>
        </ul>

        {/* social media */}
        <ul className=" text-plum text-lg flex flex-col gap-[1.25rem]">
          <li>Social media</li>
          <li className="flex gap-[22px] ">
            {socialMediaLinks.map((item, index) => (
              <a
                key={item}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                {item.icon}
              </a>
            ))}
          </li>
        </ul>
      </div>

      {/* copyrigths */}
      <div className="border-t-2 border-purple-200 py-4 md:py-0 md:px-[75px]">
        <div className="w-[80%] m-auto md:w-full">
          <div className="text-center md:text-left md:flex text-lg justify-between items-center">
            <div>
              <p className="text-plum ">
                Copyright © HAVE A SEAT. All rights reserved.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
