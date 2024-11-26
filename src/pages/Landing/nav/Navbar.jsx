import { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import logo from "/assets/has_logo.png";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/components/constants/constants";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="py-4">
      <nav className="px-5 md:px-20 flex justify-between items-center">
        <div className="bg-white md:max-w-[150px] rounded-[32px] p-1 md:p-2 flex items-center justify-center cursor-pointer">
          <img src={logo} alt="" className="w-20 h-8 md:w-32 md:h-12" />
        </div>

        <button
          onClick={toggleNavbar}
          type="button"
          className="md:hidden block text-textColor focus:outline-none p-2"
        >
          <Menu className="text-white" size="30" />
        </button>

        {/* Mobile Nav */}
        <div
          className={`fixed top-0 left-0 bg-white w-full h-screen z-20 transform transition-transform duration-500 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <X
            onClick={toggleNavbar}
            className="absolute right-4 top-4 text-textColor cursor-pointer"
            size={30}
          />

          <ul className="flex flex-col items-center text-center text-textColor py-10">
            <li className="my-2 cursor-pointer hover:bg-plum hover:text-white text-link w-full p-2 decoration-secondary">
              <Link to="/about">About</Link>
            </li>
            <li className="my-2 cursor-pointer hover:bg-plum hover:text-white text-link w-full p-2 decoration-secondary">
              <Link to="/Menu">Menu</Link>
            </li>
            <li className="my-2 cursor-pointer hover:bg-plum hover:text-white text-link w-full p-2 decoration-secondary">
              <Link to="/contact">Contact</Link>
            </li>
            <li className="my-2">
              <Link
                to="/reservation"
                className="px-4 py-2 text white border  rounded-lg text-white text-lg bg-plum "
              >
                Book a Table
              </Link>
            </li>
          </ul>
        </div>

        <div className="hidden md:flex gap-11">
          <ul className="flex gap-10">
            {navLinks.map((link) => (
              <li key={link.to} className="my-2 cursor-pointer text-white">
                <ScrollLink
                  to={link.to} // Matches the `id` of the target section
                  spy={true}
                  smooth={true}
                  duration={1500}
                  activeClass="underline decoration-plum text-white"
                >
                  {link.label} {/* Display the label */}
                </ScrollLink>
              </li>
            ))}
          </ul>
          <Link
            to="/reservation"
            className="px-4 py-2 text white border  rounded-lg text-white text-lg hover:bg-plum hover:text-white"
          >
            Book a Table
          </Link>
        </div>
      </nav>
    </div>
  );
}
