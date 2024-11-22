import {
  footerLinks,
  socialMediaLinks,
} from "../../../components/constants/constants";
import logo from "/assets/tags-logo.png";
function Footer() {
  return (
    <div>
      {/* web*/}
      <div className=" hidden md:flex px-5 md:px-[75px] py-24  flex-col md:flex-row justify-between">
        <div></div>
        <ul className="text-plum text-lg flex flex-col gap-[1.25rem]">
          <li className="font-bold">+1 (860) 960-0316</li>
          <li>contact@haveaseaton.com</li>
          <li className="text-white rounded-lg bg-plum py-3 px-10 text-center cursor-pointer">
            Book a Table
          </li>
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

        {/* social media */}
        <ul className=" text-plum text-lg flex flex-col gap-[1.25rem]">
          <li>Social media</li>
          <li className="flex gap-[22px] ">
            {socialMediaLinks.map((link) => (
              <img src={link} key={link} />
            ))}
          </li>
        </ul>
      </div>
      {/* mobile */}
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
          <li>contact@haveaseaton.com</li>
          <li className="text-white rounded-lg w-[65%] bg-plum py-3 px-10 text-center cursor-pointer">
            Book a Table
          </li>
        </ul>

        {/* social media */}
        <ul className=" text-plum text-lg flex flex-col gap-[1.25rem]">
          <li>Social media</li>
          <li className="flex gap-[22px] ">
            {socialMediaLinks.map((link) => (
              <img src={link} key={link} />
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
            {/* <div className="text-center hidden md:text-left flex items-center justify-center md:justify-between">
              <span className="block">Powered by </span>
              <img height="100" width="100" src={logo} alt="" />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
