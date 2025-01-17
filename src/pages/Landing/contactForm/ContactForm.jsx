import BookRestaurant from "../BookResturant/BookRestaurant";

export default function ContactForm() {
  return (
   <div className="bg-[#F5EDFC]">
    <BookRestaurant />
     <div className="flex items-center px-20 md:px-40 justify-center  p-6">       
      <div className=" max-w-lg py-10 mx-auto">
        <h1 className="text-center text-3xl md:text-6xl font-bold font-raleWay text-gray-900">
          Have <span className="text-purple-500">Queries</span> or <span className="text-purple-500">Suggestions?</span>
        </h1>
        <p className="text-center font-raleWay font-bold my-3 mt-4 md:mt-12 text-2xl md:text-4xl">Get in touch</p>
        <p className="text-center my-4">You can reach us at anytime.</p>

        <form className="  space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="First name"
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="text"
              placeholder="Last name"
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div className="relative">
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <span className="absolute left-3 top-3 text-gray-400">
              📧
            </span>
          </div>
          <textarea
            placeholder="How can we help?"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            rows="4"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-3 rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
   </div>
  )
}
