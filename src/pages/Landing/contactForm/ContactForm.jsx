import { AiOutlineMail } from "react-icons/ai";
import BookRestaurant from "../BookResturant/BookRestaurant";

export default function ContactForm() {
  return (
   <div className="bg-[#F5EDFC]">
    <BookRestaurant />
     <div className="flex items-center px-20 md:px-40 justify-center  p-6">       
      <div className="py-10 mx-auto">
        <p className=" text-3xl sm:text-5xl md:text-6xl font-bold font-agrandir text-center text-shipGrey">  
          Have <span className="text-plum">Queries</span> or <br></br> <span className="text-plum">Suggestions?</span>
        </p>
        <div className="flex flex-col items-center gap-1 my-3 sm:my-7 md:my-14">
        <p className="text-center font-agrandir text-shipGrey font-bold text-xl sm:text-2xl md:text-5xl mt-9">Get in touch</p>
        <p className="text-center font-roboto font-normal text-shipGrey text-sm sm:text-xl md:text-2xl">You can reach us at anytime.</p>
        </div>

        <form className="space-y-2 sm:space-y-4">
          <div className="flex flex-col md:flex-row gap-2 sm:gap-4">
            <input
              type="text"
              placeholder="First name"
              className="flex-1 p-2 sm:p-4 px-7 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="text"
              placeholder="Last name"
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
                type="email"
                placeholder="Your email"
                className="w-full p-4 pl-12 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

          <textarea
            placeholder="How can we help?"
            className="w-full p-2 sm:p-4 px-7 rounded-[32px] focus:outline-none focus:ring-2 focus:ring-purple-400"
            rows="4"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-plum text-white py-2 sm:py-3 rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400
            text-lg sm:text-xl font-roboto font-medium"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
   </div>
  )
}
