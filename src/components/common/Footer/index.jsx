import { Facebook, Mail, MapPin, PhoneCall } from "lucide-react";
import { Linkedin, Twitter, Instagram, GitBranch } from "lucide-react";

const Footer = () => {
  
  return (
    <section className="w-full h-full">
      <div className="relative h-[600px] sm:[500] md:h-[400px] lg:h-[400px] w-full p-6 bg-[url('/assets/footer_bg.jpg')] bg-no-repeat bg-cover bg-center">
        <div className="absolute inset-0 bg-primary opacity-80 "></div>
        <div className="absolute align-middle z-10 max-w-screen-xl left-0 right-0 mx-auto p-6">
          <div className="flex flex-col lg:flex-row align-middle justify-center items-center lg:items-start lg:space-x-8">
            <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
              <div className="flex flex-col items-center lg:items-start">
                <div className="self-center italic text-5xl mb-4 text-white font-semibold whitespace-nowrap custom-font">
                  Have a Seat
                </div>
                <p className="text-white text-lg mb-4 font-bold mt-4 lg:text-left">
                Experience seamless dining reservations with the world at your fingertips and Join millions of diners worldwide and reserve your next meal with confidence.
                </p>
                <div className="flex space-x-4 mt-8">
                <div className="relative bg-purple-600 rounded-full p-2">
                    <Facebook fill="white" className="cursor-pointer text-white w-6 h-6" />
                    <span className="absolute inset-0 rounded-full border-2 border-white pointer-events-none"></span>
                  </div>
                  <div className="relative bg-purple-600 rounded-full p-2">
                    <Instagram  className="cursor-pointer text-white w-6 h-6" />
                    <span className="absolute inset-0 rounded-full border-2 border-white pointer-events-none"></span>
                  </div>
                  <div className="relative bg-purple-600 rounded-full p-2">
                    <Twitter fill="white" className="cursor-pointer text-white w-6 h-6" />
                    <span className="absolute inset-0 rounded-full border-2 border-white pointer-events-none"></span>
                  </div>
                  <div className="relative bg-purple-600 rounded-full p-2">
                    <Linkedin fill="white" className="cursor-pointer text-white w-6 h-6" />
                    <span className="absolute inset-0 rounded-full border-2 border-white pointer-events-none"></span>
                  </div>
                  <div className="relative bg-purple-600 rounded-full p-2">
                    <GitBranch  className="cursor-pointer text-white w-6 h-6" />
                    <span className="absolute inset-0 rounded-full border-2 border-white pointer-events-none"></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/4">
              <div className="flex flex-col items-center lg:items-start">
                <h1 className="text-white underline font-bold text-2xl non-italic">
                  CONTACT US 
                </h1>
                <ul className="mt-8 text-white list-square space-y-4 text-2xl">
                <li className="flex items-center">
                      <span className="">
                       <PhoneCall fill="white" className="mr-4"/> 
                      </span>
                      +1 (860) 960-0316
                    </li>
                    <hr/>
                    <li className="flex items-center">
                      <span className="">
                        <Mail  className="mr-4"/>
                      </span>
                      contact@haveaseaton.com
                    </li>
                    <hr/>
                    <li className="flex items-center">
                      <span className="">
                        <MapPin   className="mr-4"/>  
                      </span>
                      New York
                    </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;

