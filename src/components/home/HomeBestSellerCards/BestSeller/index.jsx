import { ArrowRight } from "lucide-react";

const BestSeller = () => {
  return (
    <div className="w-full flex flex-col md:flex-row lg:flex-row items-center mt-8 justify-center md:space-x-8 lg:space-x-8">
      <div className="relative flex flex-col md:flex-row lg:flex-row sm:flex-row mb-8 sm:mb-0">
        <div className="order-1 md:order-0 lg:order-0 sm:order-0">
          <img
            src="/assets/offer_slider_1.png"
            className="rounded h-[280px] md:h-[300px] lg:h-[300px] w-full md:w-[700px] sm:h-auto"
            alt=""
          />
        </div>
        <div className="ml-8 absolute inset-0 flex flex-col mt-8 justify-left items-left text-white order-0 md:order-1 lg:order-1 sm:order-1">
          <h1 className="sm:text-lg md:text-2xl font-bold mb-4 text-purple-600 italic">
            Weekly Best Seller
          </h1>
          <p className="sm:text-xl md:text-3xl mb-4 text-gray-600 font-bold">
            Spade's Cafe
          </p>
          <p className="sm:text-sm md:text-lg text-gray-600">
            Neque porro quisquam <br /> est qui dolor <br /> ipsum quia dolor sit
            ametsed.
          </p>
          <p className="sm:text-sm md:text-lg underline mt-4 text-gray-600">
            <span className="flex cursor-pointer">
              Visit Now <ArrowRight className="mt-2 h-5" />
            </span>
          </p>
        </div>
      </div>
      <div className="relative flex flex-col md:flex-row lg:flex-row sm:flex-row mb-8 sm:mt-4">
        <div className="order-1 md:order-0 lg:order-0 sm:order-0">
          <img
            src="/assets/offer_slider_2.png"
            className="rounded h-[280px] md:h-[300px] lg:h-[300px] w-full md:w-[700px] sm:h-auto"
            alt=""
          />
        </div>
        <div className="ml-8 absolute inset-0 flex flex-col mt-8 justify-left items-left text-white order-0 md:order-1 lg:order-1 sm:order-1">
          <h1 className="sm:text-lg md:text-2xl font-bold mb-4 text-purple-600 italic">
            Daily Offers
          </h1>
          <p className="sm:text-xl md:text-3xl mb-4 text-gray-600 font-bold">
            StarBucks
          </p>
          <p className="sm:text-sm md:text-lg text-gray-600">
          Neque porro quisquam <br /> est qui dolor <br /> ipsum quia dolor sit
            ametsed.
          </p>
          <p className="sm:text-sm md:text-lg underline mt-4 text-gray-600">
            <span className="flex cursor-pointer">
              Visit Now <ArrowRight className="mt-2 h-5" />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BestSeller;
